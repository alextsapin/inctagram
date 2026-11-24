import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { Post, postQueryKeys, updatePost } from '@/entities/post';
import { profileQueryKeys } from '@/entities/profile';

type EditPostVariables = {
    postId: string;
    caption: string;
};

export const useEditPost = (): UseMutationResult<void, Error, EditPostVariables> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, caption }: EditPostVariables) =>
            updatePost(postId, caption),

        onSuccess: (_, variables) => {
            // 1. СИНХРОННО и МГНОВЕННО обновляем кэш детального поста.

            queryClient.setQueryData<Post>(postQueryKeys.detail(variables.postId), old =>
                old ? { ...old, caption: variables.caption.trim() } : old,
            );

            // 2. Обновляем ленту (Feed)
            queryClient.invalidateQueries({
                queryKey: postQueryKeys.feed(),
            });

            // 3. Инвалидируем посты пользователя.
            queryClient.invalidateQueries({
                queryKey: postQueryKeys.all,
                predicate: query => query.queryKey[1] === 'userPosts',
            });

            // 4. Обновляем сущность профиля (счетчики, описание и т.д.)
            queryClient.invalidateQueries({
                queryKey: profileQueryKeys.all,
            });
        },
    });
};
