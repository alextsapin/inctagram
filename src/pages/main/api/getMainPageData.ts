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

const REVALIDATE_SECONDS = 60;
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

    try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/public/main`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!response.ok) {
            throw new Error(`Main API returned ${response.status}`);
        }

        const data = (await response.json()) as MainFeedResponseDto;

        return {
            source: 'api',
            posts: data.items,
            registeredUsersCount: data.registeredUsersCount,
        };
    } catch {
        return isDevelopment ? getMockMainPageData() : { source: 'unavailable' };
    }
};
