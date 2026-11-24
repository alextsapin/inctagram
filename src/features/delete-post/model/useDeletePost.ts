import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { deletePost, postQueryKeys } from '@/entities/post';
import { profileQueryKeys } from '@/entities/profile';

export const useDeletePost = (): UseMutationResult<void, Error, string> => {
    const qc = useQueryClient();

    return useMutation({
        mutationKey: ['post', 'delete'],
        mutationFn: deletePost,

        onSuccess: (_, postId) => {
            // 1. Publications в профиле
            qc.invalidateQueries({ queryKey: profileQueryKeys.all });

            // ── 2. Списки постов — да, детальную — нет ────────────────
            // триггерит рефетч detail → 404 → в окне мелькнёт ошибка.
            // Поэтому исключаем 'detail' из инвалидации.
            qc.invalidateQueries({
                queryKey: postQueryKeys.all,
                predicate: q => q.queryKey[1] !== 'detail',
                refetchType: 'all', // refetchType: 'all' заставляет сделать запрос СРАЗУ, даже если лента скрыта модалкой.
            });

            // ── 3. Чистим detail удалённого поста из кэша ─────────────
            // type: 'inactive' — удаляем только если на этот пост сейчас никто не смотрит.
            // Если смотрит — он удалится из кэша, как только компонент размонтируется.
            qc.removeQueries({
                queryKey: postQueryKeys.detail(postId),
                type: 'inactive',
            });
        },
    });
};
