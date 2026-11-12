export const postQueryKeys = {
    all: ['posts'] as const,

    detail: (id: string) => [...postQueryKeys.all, 'detail', id] as const,

    // ВНИМАНИЕ: ключ userPosts используется useInfiniteQuery, поэтому кэш имеет
    // форму InfiniteData (страницы), а НЕ Post[]. Не использовать этот ключ с обычным
    // useQuery<Post[]> — форма кэша несовместима (важно для задач 7/10/11).
    userPosts: (username: string) =>
        [...postQueryKeys.all, 'userPosts', username] as const,

    feed: () => [...postQueryKeys.all, 'feed'] as const,
};
