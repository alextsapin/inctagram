// Shared query keys for lists, post details and subsequent cache invalidation.
// Mutations can invalidate every post query with postQueryKeys.all.
export const postQueryKeys = {
    all: ['posts'] as const,
    lists: () => [...postQueryKeys.all, 'list'] as const,
    userPosts: (username: string) =>
        [...postQueryKeys.lists(), 'user', username] as const,
    feed: () => [...postQueryKeys.lists(), 'feed'] as const,
    details: () => [...postQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...postQueryKeys.details(), id] as const,
};
