import { readFileSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import path from 'node:path';

const HTTP_SUCCESS_MIN = 200;
const HTTP_REDIRECT_MIN = 300;
const HEADER_PAIR_SIZE = 2;
const PINNED_API_ORIGIN = 'https://blackdragonmedia.info';
const PINNED_CERTIFICATE_FINGERPRINT =
    'D4:FA:65:4B:3A:7B:65:11:C9:02:8F:FF:FA:00:6B:CB:4D:29:16:8D:52:82:81:E8:C0:F7:1C:AA:4F:F8:ED:0D';
const PINNED_CERTIFICATE_PATH = path.join(
    process.cwd(),
    'certificates',
    'blackdragonmedia.info.pem',
);
const RETRYABLE_TLS_ERROR_CODES = new Set([
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'ERR_TLS_CERT_ALTNAME_INVALID',
]);

export type ServerApiResponse = {
    body: Buffer;
    headers: Headers;
    ok: boolean;
    setCookies: string[];
    status: number;
    statusText: string;
    timeToHeadersMs: number;
    tlsMode: 'system' | 'pinned';
};

type ServerApiRequestInit = {
    body?: Buffer;
    headers?: Headers;
    method?: string;
    signal?: AbortSignal;
};

const getErrorCode = (error: unknown): string | null => {
    if (!error || typeof error !== 'object') return null;

    if ('code' in error) return String(error.code);

    if ('cause' in error) return getErrorCode(error.cause);

    return null;
};

const createRequestHeaders = (
    headersInit: Headers | undefined,
    body: Buffer | undefined,
): Record<string, string> => {
    const headers = new Headers(headersInit);

    headers.delete('connection');
    headers.delete('content-length');
    headers.delete('host');

    if (body) {
        headers.set('content-length', String(body.byteLength));
    }

    return Object.fromEntries(headers.entries());
};

const createResponseHeaders = (
    rawHeaders: string[],
): { headers: Headers; setCookies: string[] } => {
    const headers = new Headers();
    const setCookies: string[] = [];

    for (let index = 0; index < rawHeaders.length; index += HEADER_PAIR_SIZE) {
        const name = rawHeaders[index];
        const value = rawHeaders[index + 1];

        if (name && value !== undefined) {
            if (name.toLowerCase() === 'set-cookie') {
                setCookies.push(value);
            } else {
                headers.append(name, value);
            }
        }
    }

    return { headers, setCookies };
};

const performRequest = (
    url: URL,
    init: ServerApiRequestInit,
    requestStartedAt: number,
    usePinnedCertificate: boolean,
): Promise<ServerApiResponse> =>
    new Promise((resolve, reject) => {
        const isHttps = url.protocol === 'https:';
        const request = isHttps ? httpsRequest : httpRequest;
        const tlsOptions =
            isHttps && usePinnedCertificate
                ? {
                      ca: readFileSync(PINNED_CERTIFICATE_PATH),
                      checkServerIdentity: (
                          _hostname: string,
                          peerCertificate: { fingerprint256?: string },
                      ): Error | undefined => {
                          if (
                              peerCertificate.fingerprint256 !==
                              PINNED_CERTIFICATE_FINGERPRINT
                          ) {
                              return new Error(
                                  'Backend TLS certificate fingerprint does not match',
                              );
                          }

                          return undefined;
                      },
                      rejectUnauthorized: true,
                  }
                : {};

        const upstreamRequest = request(
            url,
            {
                ...tlsOptions,
                headers: createRequestHeaders(init.headers, init.body),
                method: init.method ?? 'GET',
                signal: init.signal,
            },
            upstreamResponse => {
                const timeToHeadersMs = Math.round(performance.now() - requestStartedAt);
                const chunks: Buffer[] = [];

                upstreamResponse.on('data', chunk => chunks.push(Buffer.from(chunk)));
                upstreamResponse.on('end', () => {
                    const status = upstreamResponse.statusCode ?? 0;
                    const { headers, setCookies } = createResponseHeaders(
                        upstreamResponse.rawHeaders,
                    );

                    resolve({
                        body: Buffer.concat(chunks),
                        headers,
                        ok: status >= HTTP_SUCCESS_MIN && status < HTTP_REDIRECT_MIN,
                        setCookies,
                        status,
                        statusText: upstreamResponse.statusMessage ?? '',
                        timeToHeadersMs,
                        tlsMode: usePinnedCertificate ? 'pinned' : 'system',
                    });
                });
                upstreamResponse.on('error', reject);
            },
        );

        upstreamRequest.on('error', reject);

        if (init.body) {
            upstreamRequest.write(init.body);
        }

        upstreamRequest.end();
    });

export const requestServerApi = async (
    url: URL,
    init: ServerApiRequestInit = {},
): Promise<ServerApiResponse> => {
    const requestStartedAt = performance.now();

    try {
        return await performRequest(url, init, requestStartedAt, false);
    } catch (error) {
        const canUsePinnedCertificate =
            url.origin === PINNED_API_ORIGIN &&
            RETRYABLE_TLS_ERROR_CODES.has(getErrorCode(error) ?? '');

        if (!canUsePinnedCertificate) throw error;

        return performRequest(url, init, requestStartedAt, true);
    }
};
