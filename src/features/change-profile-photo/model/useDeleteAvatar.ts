'use client';

import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { profileApi } from '@/entities/profile';

import { invalidateAvatarCaches } from './invalidateAvatarCaches';

/**
 * Удаляет аватар через `PUT /api/v1/profile` с `avatar: null`.
 *
 * Отдельный хук, а не `useUpdateProfile` из `features/edit-profile`: фича не
 * может импортировать другую фичу. Запрос тот же самый — `profileApi.updateProfile`.
 *
 * При успехе инвалидирует те же ключи, что `useUpdateProfile` при смене avatar.
 * При ошибке пробрасывает исходную ошибку axios — для текста используй
 * `normalizeProfileError` из `@/entities/profile`.
 */
export const useDeleteAvatar = (): UseMutationResult<void, Error, void> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => profileApi.updateProfile({ avatar: null }),

        onSuccess: () => {
            invalidateAvatarCaches(queryClient);
        },
    });
};
