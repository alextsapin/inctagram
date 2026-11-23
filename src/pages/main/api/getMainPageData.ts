import { readFileSync } from 'node:fs';
import { request as httpsRequest } from 'node:https';
import path from 'node:path';

type MainPost = {
    id: string;
    description: string;
    photos: {
        id: number;
        url: string;
    }[];
    previewUrl: string | null;
    createdAt: string;
    author: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
};

type MainFeedResponseDto = {
    items: MainPost[];
    registeredUsersCount: number;
};

export type MainPageData =
    | {
          source: 'api';
          posts: MainPost[];
          registeredUsersCount: number;
      }
    | {
          source: 'unavailable';
      };

const API_TIMEOUT_MS = 15_000;
const HTTP_SUCCESS_MIN = 200;
const HTTP_REDIRECT_MIN = 300;
const PINNED_API_ORIGIN = 'https://blackdragonmedia.info';
const PINNED_CERTIFICATE_FINGERPRINT =
    'D4:FA:65:4B:3A:7B:65:11:C9:02:8F:FF:FA:00:6B:CB:4D:29:16:8D:52:82:81:E8:C0:F7:1C:AA:4F:F8:ED:0D';
const PINNED_CERTIFICATE_PATH = path.join(
    process.cwd(),
    'certificates',
    'blackdragonmedia.info.pem',
);

type MainFeedHttpResponse = {
    body: string;
    ok: boolean;
    status: number;
    timeToHeadersMs: number;
    tlsMode: 'system' | 'pinned';
};

const getErrorCauseCode = (error: unknown): string | null => {
    if (!(error instanceof Error)) return null;

    const { cause } = error;

    return cause && typeof cause === 'object' && 'code' in cause
        ? String(cause.code)
        : null;
};

const requestWithPinnedCertificate = (
    url: URL,
    signal: AbortSignal,
    requestStartedAt: number,
): Promise<MainFeedHttpResponse> =>
    new Promise((resolve, reject) => {
        const certificate = readFileSync(PINNED_CERTIFICATE_PATH);
        let timeToHeadersMs = 0;

        const request = httpsRequest(
            url,
            {
                ca: certificate,
                checkServerIdentity: (_hostname, peerCertificate) => {
                    if (
                        peerCertificate.fingerprint256 !== PINNED_CERTIFICATE_FINGERPRINT
                    ) {
                        return new Error(
                            'Main API TLS certificate fingerprint does not match',
                        );
                    }

                    return undefined;
                },
                rejectUnauthorized: true,
                signal,
            },
            response => {
                timeToHeadersMs = Math.round(performance.now() - requestStartedAt);
                const chunks: Buffer[] = [];

                response.on('data', chunk => chunks.push(Buffer.from(chunk)));
                response.on('end', () => {
                    const status = response.statusCode ?? 0;

                    resolve({
                        body: Buffer.concat(chunks).toString('utf8'),
                        ok: status >= HTTP_SUCCESS_MIN && status < HTTP_REDIRECT_MIN,
                        status,
                        timeToHeadersMs,
                        tlsMode: 'pinned',
                    });
                });
                response.on('error', reject);
            },
        );

        request.on('error', reject);
        request.end();
    });

const requestMainFeed = async (
    url: URL,
    signal: AbortSignal,
    requestStartedAt: number,
): Promise<MainFeedHttpResponse> => {
    try {
        const response = await fetch(url, { signal });
        const timeToHeadersMs = Math.round(performance.now() - requestStartedAt);

        return {
            body: await response.text(),
            ok: response.ok,
            status: response.status,
            timeToHeadersMs,
            tlsMode: 'system',
        };
    } catch (error) {
        const causeCode = getErrorCauseCode(error);
        const canUsePinnedCertificate =
            url.origin === PINNED_API_ORIGIN &&
            (causeCode === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
                causeCode === 'ERR_TLS_CERT_ALTNAME_INVALID');

        if (!canUsePinnedCertificate) throw error;

        return requestWithPinnedCertificate(url, signal, requestStartedAt);
    }
};

export const getMainPageData = async (): Promise<MainPageData> => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const apiUrl = process.env.SERVER_API_URL;

    if (!apiUrl) {
        return { source: 'unavailable' };
    }

    const requestStartedAt = performance.now();
    let responseStatus: number | null = null;
    let timeToHeadersMs: number | null = null;

    try {
        const endpoint = new URL(`${apiUrl.replace(/\/$/, '')}/api/v1/public/main`);
        const response = await requestMainFeed(
            endpoint,
            AbortSignal.timeout(API_TIMEOUT_MS),
            requestStartedAt,
        );

        responseStatus = response.status;
        timeToHeadersMs = response.timeToHeadersMs;

        if (!response.ok) {
            throw new Error(`Main API returned ${response.status}`);
        }

        const bodyStartedAt = performance.now();
        const data = JSON.parse(response.body) as MainFeedResponseDto;

        // eslint-disable-next-line no-console
        console.info('[Main ISR] API request completed', {
            status: responseStatus,
            timeToHeadersMs,
            bodyReadMs: Math.round(performance.now() - bodyStartedAt),
            totalMs: Math.round(performance.now() - requestStartedAt),
            postsCount: data.items.length,
            tlsMode: response.tlsMode,
        });

        return {
            source: 'api',
            posts: data.items,
            registeredUsersCount: data.registeredUsersCount,
        };
    } catch (error) {
        const cause = error instanceof Error ? error.cause : undefined;
        const causeCode = getErrorCauseCode(error);

        // eslint-disable-next-line no-console
        console.error('[Main ISR] API request failed', {
            status: responseStatus,
            timeToHeadersMs,
            elapsedMs: Math.round(performance.now() - requestStartedAt),
            errorName: error instanceof Error ? error.name : 'UnknownError',
            errorMessage: error instanceof Error ? error.message : String(error),
            causeCode,
            causeMessage: cause instanceof Error ? cause.message : null,
        });

        if (isDevelopment) {
            return { source: 'unavailable' };
        }

        // Build stays available even when the backend is down.
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return { source: 'unavailable' };
        }

        // ISR must retain the last successfully generated page.
        throw error;
    }
};
