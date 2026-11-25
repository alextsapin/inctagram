'use client';

import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { profileApi, type UploadAvatarResponse } from '@/entities/profile';

import { invalidateAvatarCaches } from './invalidateAvatarCaches';

/**
 * Загружает аватар через `profileApi.uploadAvatar` (POST, multipart, поле `avatar`).
 *
 * При успехе инвалидирует те же ключи, что `useUpdateProfile` при смене avatar:
 * `/me`, профиль текущего пользователя и все посты (avatar автора лежит внутри
 * каждого поста в кэше). При ошибке пробрасывает исходную ошибку axios — для
 * текста используй `normalizeAvatarUploadError` из `@/entities/profile`.
 *
 * TODO(BLD-165): путь ручки примерный (см. AVATAR_UPLOAD_PATH) — при смене
 * пути/формы ответа править только entities/profile, хук не меняется.
 */
export const useUploadAvatar = (): UseMutationResult<
    UploadAvatarResponse,
    Error,
    Blob
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: Blob) => profileApi.uploadAvatar(file),

        onSuccess: () => {
            invalidateAvatarCaches(queryClient);
        },
    });
};
