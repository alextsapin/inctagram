'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getUserPostsPage } from '../api/postApi';
import { postQueryKeys } from '../api/queryKeys';

import type { Post } from './type';

// Размер страницы постов профиля при бесконечной загрузке (задача 12 / BLD-142).
const POSTS_PER_PAGE = 8;

type UseUserPostsInfinite = {
    posts: Post[];
    fetchNextPage: () => void;
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
// queryKey — существующий postQueryKeys.userPosts(username), чтобы будущая
// инвалидация postQueryKeys.all (задачи 7/10/11) обновляла и список профиля.
export const useUserPostsInfinite = (username: string): UseUserPostsInfinite => {
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
        queryKey: postQueryKeys.userPosts(username),
        queryFn: ({ pageParam }) => getUserPostsPage(username, pageParam, POSTS_PER_PAGE),
        initialPageParam: null as string | null,
        getNextPageParam: lastPage => lastPage.nextCursor,
        enabled: Boolean(username),
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
