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

export type MainPageData = {
    posts: MainPost[];
    registeredUsersCount: number;
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
    posts: getMockLatestPosts(POSTS_LIMIT).map(mapMockPost),
    registeredUsersCount: MOCK_REGISTERED_USERS_COUNT,
});

const shouldUseMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const getMainPageData = async (): Promise<MainPageData> => {
    if (shouldUseMocks) {
        return getMockMainPageData();
    }

    const apiUrl = process.env.SERVER_API_URL;

    if (!apiUrl) {
        throw new Error('SERVER_API_URL is not configured');
    }

    try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/public/main`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!response.ok) {
            throw new Error(`Failed to load main page: ${response.status}`);
        }

        const data = (await response.json()) as MainFeedResponseDto;

        return {
            posts: data.items,
            registeredUsersCount: data.registeredUsersCount,
        };
    } catch (error) {
        if (process.env.NODE_ENV !== 'development') {
            throw error;
        }

        return getMockMainPageData();
    }
};
