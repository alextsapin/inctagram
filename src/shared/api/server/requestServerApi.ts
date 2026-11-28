import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

const HTTP_SUCCESS_MIN = 200;
const HTTP_REDIRECT_MIN = 300;
const HEADER_PAIR_SIZE = 2;

export type ServerApiResponse = {
    body: Buffer;
    headers: Headers;
    ok: boolean;
    setCookies: string[];
    status: number;
    statusText: string;
    timeToHeadersMs: number;
};

type ServerApiRequestInit = {
    body?: Buffer;
    headers?: Headers;
    method?: string;
    signal?: AbortSignal;
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

export const requestServerApi = (
    url: URL,
    init: ServerApiRequestInit = {},
): Promise<ServerApiResponse> =>
    new Promise((resolve, reject) => {
        const requestStartedAt = performance.now();
        const request = url.protocol === 'https:' ? httpsRequest : httpRequest;

        const upstreamRequest = request(
            url,
            {
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
