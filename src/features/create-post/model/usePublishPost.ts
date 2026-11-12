import {
    useMutation,
    useQueryClient,
    type UseMutationResult,
} from '@tanstack/react-query';

import { createPost, postQueryKeys, type Post } from '@/entities/post';

import { createPostFormData } from '../lib/createPostFormData';
import { deleteDraft } from '../lib/draft';

import type { CreatePostPhoto } from './types';

type PublishPostParams = {
    photos: CreatePostPhoto[];
    description: string;
};

// Отправляет пост на сервер. После успеха перезагружает посты в профиле автора,
// чтобы новый пост появился там первым, и удаляет черновик: пост сохранён,
// черновик больше не нужен
export const usePublishPost = (
    userId: string,
    username: string,
): UseMutationResult<Post, Error, PublishPostParams> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ photos, description }: PublishPostParams) =>
            createPost(createPostFormData(photos, description)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: postQueryKeys.userPosts(username),
            });

            // Пост уже создан, поэтому если черновик не удалился, публикацию не ломаем
            await deleteDraft(userId).catch(() => undefined);
        },
    });
};
