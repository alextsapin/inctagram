import {
    getMockLatestPosts,
    MOCK_REGISTERED_USERS_COUNT,
    type Post,
} from '@/entities/post';

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
          source: 'api' | 'mock';
          posts: MainPost[];
          registeredUsersCount: number;
      }
    | {
          source: 'unavailable';
      };

const API_TIMEOUT_MS = 15_000;
const POSTS_LIMIT = 4;

const mapMockPost = (post: Post): MainPost => ({
    id: post.id,
    description: post.caption ?? '',
    photos: post.images.map((image, index) => ({
        id: index,
        url: image.url,
    })),
    previewUrl: post.images[0]?.url ?? null,
    createdAt: post.createdAt,
    author: {
        id: post.author.id,
        username: post.author.username,
        avatarUrl: post.author.avatarUrl,
    },
});

const getMockMainPageData = (): MainPageData => ({
    source: 'mock',
    posts: getMockLatestPosts(POSTS_LIMIT).map(mapMockPost),
    registeredUsersCount: MOCK_REGISTERED_USERS_COUNT,
});

export const getMainPageData = async (): Promise<MainPageData> => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
        return getMockMainPageData();
    }

    const apiUrl = process.env.SERVER_API_URL;

    if (!apiUrl) {
        return isDevelopment ? getMockMainPageData() : { source: 'unavailable' };
    }

    const requestStartedAt = performance.now();
    let responseStatus: number | null = null;
    let timeToHeadersMs: number | null = null;

    try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/public/main`, {
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        responseStatus = response.status;
        timeToHeadersMs = Math.round(performance.now() - requestStartedAt);

        if (!response.ok) {
            throw new Error(`Main API returned ${response.status}`);
        }

        const bodyStartedAt = performance.now();
        const data = (await response.json()) as MainFeedResponseDto;

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
        const causeCode =
            cause && typeof cause === 'object' && 'code' in cause
                ? String(cause.code)
                : null;

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
            return getMockMainPageData();
        }

        // Build stays available even when the backend is down.
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return { source: 'unavailable' };
        }

        // ISR must retain the last successfully generated page.
        throw error;
    }
};
