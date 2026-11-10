export const postQueryKeys = {
    all: ['posts'] as const,

    detail: (id: string) => [...postQueryKeys.all, 'detail', id] as const,

    userPosts: (username: string) =>
        [...postQueryKeys.all, 'userPosts', username] as const,

    feed: () => [...postQueryKeys.all, 'feed'] as const,
};
