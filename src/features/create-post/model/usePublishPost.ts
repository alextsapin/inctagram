import {
    useMutation,
    useQueryClient,
    type UseMutationResult,
} from '@tanstack/react-query';

import { createPost, postQueryKeys } from '@/entities/post';
import { profileQueryKeys } from '@/entities/profile';

import { createPostFormData } from '../lib/createPostFormData';
import { deleteDraft } from '../lib/draft';

import type { CreatePostPhoto } from './types';

type PublishPostParams = {
    photos: CreatePostPhoto[];
    description: string;
};

// Отправляет пост на сервер. После успеха перезагружает посты, чтобы новый пост
// появился в профиле первым, и профили, чтобы вырос счётчик Publications.
// Потом удаляет черновик: пост сохранён, черновик больше не нужен
export const usePublishPost = (
    userId: string,
): UseMutationResult<void, Error, PublishPostParams> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ photos, description }: PublishPostParams) =>
            createPost(createPostFormData(photos, description)),
        onSuccess: async () => {
            // Обновляем все посты и все профили: новый пост должен появиться в списке
            // профиля, ключ которого строится по userId.
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: postQueryKeys.all }),
                queryClient.invalidateQueries({ queryKey: profileQueryKeys.all }),
            ]);

            // Пост уже создан, поэтому если черновик не удалился, публикацию не ломаем
            await deleteDraft(userId).catch(() => undefined);
        },
    });
};
