import {
    getMockLatestPosts,
    MOCK_REGISTERED_USERS_COUNT,
    type Post,
} from '@/entities/post';

const POSTS_LIMIT = 4;

export type MainPageData = {
    posts: Post[];
    registeredUsersCount: number;
};

export const getMainPageData = async (): Promise<MainPageData> => ({
    posts: getMockLatestPosts(POSTS_LIMIT),
    registeredUsersCount: MOCK_REGISTERED_USERS_COUNT,
});
