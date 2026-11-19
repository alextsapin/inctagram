'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getUserPostsPage } from '../api/postApi';
import { postQueryKeys } from '../api/queryKeys';

import type { Post } from './type';

type UseUserPostsInfinite = {
    posts: Post[];
    fetchNextPage: () => Promise<unknown>;
    hasNextPage: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    isPending: boolean;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isFetchNextPageError: boolean;
    refetch: () => void;
};

// Бесконечная загрузка постов пользователя.
// queryKey — существующий postQueryKeys.userPosts(userId), чтобы будущая
// инвалидация postQueryKeys.all (задачи 7/10/11) обновляла и список профиля.
export const useUserPostsInfinite = (userId: string): UseUserPostsInfinite => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isPending,
        isLoading,
        isError,
        error,
        isFetchNextPageError,
        refetch,
    } = useInfiniteQuery({
        queryKey: postQueryKeys.userPosts(userId),
        queryFn: ({ pageParam }) => getUserPostsPage(userId, pageParam),
        initialPageParam: null as string | null,
        getNextPageParam: lastPage => lastPage.nextCursor,
        enabled: Boolean(userId),
    });

    const posts = data?.pages.flatMap(page => page.posts) ?? [];

    return {
        posts,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isPending,
        isLoading,
        isError,
        error,
        isFetchNextPageError,
        refetch,
    };
};
