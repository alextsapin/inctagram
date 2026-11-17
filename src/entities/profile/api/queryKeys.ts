export const profileQueryKeys = {
    all: ['profiles'] as const,

    // Ключ профиля конкретного пользователя (шапка профиля).
    // Используется обычным useQuery (не useInfiniteQuery), форма кэша — Profile | null.
    detail: (username: string) => [...profileQueryKeys.all, 'detail', username] as const,
};
