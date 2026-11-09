import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { postApi } from '../api/postApi';

import { Post } from './type';

// 1. Выносим ключи кэша (Query Keys) в отдельный объект
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: string) => [...postKeys.details(), id] as const,
};

// 2. Хук для получения списка постов (Лента)
export const usePosts = (): UseQueryResult<Post[], Error> => {
    return useQuery({
        queryKey: postKeys.lists(),
        // Когда появится реальный API, здесь будет: return postApi.getPost('/posts');
        queryFn: async () => {
            return postApi.getPost();
        },
    });
};

// 3. Хук для получения одного поста по ID
export const usePost = (postId: string): UseQueryResult<Post, Error> => {
    return useQuery({
        queryKey: postKeys.detail(postId),
        queryFn: async () => {
            // Когда появится API: return api.get(`/posts/${postId}`);
            const post = postApi.getUserPost(postId);

            if (!post) {
                throw new Error('Пост не найден');
            }

            return post;
        },
        // Включаем запрос только если postId существует
        enabled: !!postId,
    });
};
