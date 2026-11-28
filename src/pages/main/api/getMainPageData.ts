import { requestServerApi } from '@/shared/api/server';

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

const getErrorCauseCode = (error: unknown): string | null => {
    if (!(error instanceof Error)) return null;

    const { cause } = error;

    return cause && typeof cause === 'object' && 'code' in cause
        ? String(cause.code)
        : null;
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
        const response = await requestServerApi(endpoint, {
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        responseStatus = response.status;
        timeToHeadersMs = response.timeToHeadersMs;

        if (!response.ok) {
            throw new Error(`Main API returned ${response.status}`);
        }

        const bodyStartedAt = performance.now();
        const data = JSON.parse(response.body.toString('utf8')) as MainFeedResponseDto;

        // eslint-disable-next-line no-console
        console.info('[Main ISR] API request completed', {
            status: responseStatus,
            timeToHeadersMs,
            bodyReadMs: Math.round(performance.now() - bodyStartedAt),
            totalMs: Math.round(performance.now() - requestStartedAt),
            postsCount: data.items.length,
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
