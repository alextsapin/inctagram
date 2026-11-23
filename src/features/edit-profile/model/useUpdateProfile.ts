'use client';

import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/entities/post';
import { profileApi, profileQueryKeys, type UpdateProfileDto } from '@/entities/profile';
import { currentUserQueryKey, useCurrentUser } from '@/entities/session';

export type UpdateProfileVariables = {
    data: UpdateProfileDto;
    // Username до сохранения: по нему удаляем старый ключ профиля из кэша.
    currentUsername: string;
};

/**
 * Сохраняет профиль через `PUT /api/v1/profile`.
 *
 * Принимает `{ data, currentUsername }`: `data` — только изменённые поля
 * `UpdateProfileDto`, `currentUsername` — username до сохранения (нужен, чтобы
 * удалить из кэша старый ключ профиля при смене username).
 *
 * При успехе возвращает `void` (бэкенд отвечает 204 без тела) и инвалидирует
 * `/me`, профиль и посты текущего пользователя. При ошибке пробрасывает
 * исходную ошибку axios — для текста и раскладки по полям используй
 * `normalizeProfileError` из `@/entities/profile`.
 *
 * Имена полей ответа бэкенда не совпадают с именами полей формы: `description`
 * на бэкенде — это `aboutMe` в форме. Соответствие полей настраивает задача 7;
 * хук эту таблицу не задаёт.
 */
export const useUpdateProfile = (): UseMutationResult<
    void,
    Error,
    UpdateProfileVariables
> => {
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();

    return useMutation({
        mutationFn: ({ data }: UpdateProfileVariables) => profileApi.updateProfile(data),

        onSuccess: (_, { data, currentUsername }) => {
            const nextUsername = data.username ?? currentUsername;
            const isUsernameChanged = nextUsername !== currentUsername;

            // 1. /me: username в шапке, сайдбаре и других местах.
            queryClient.invalidateQueries({ queryKey: currentUserQueryKey });

            // 2. Профиль. При смене username старый ключ удаляем, а не
            // инвалидируем: иначе браузер запросит старый username и получит 404.
            if (isUsernameChanged) {
                queryClient.removeQueries({
                    queryKey: profileQueryKeys.detail(currentUsername),
                });
                queryClient.invalidateQueries({
                    queryKey: profileQueryKeys.detail(nextUsername),
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: profileQueryKeys.detail(currentUsername),
                });
            }

            // 3. Посты: username/avatar автора лежат внутри каждого поста в кэше.
            // Инвалидируем только посты текущего пользователя, а не все подряд.
            if (currentUser) {
                queryClient.invalidateQueries({
                    queryKey: postQueryKeys.userPosts(currentUser.userId),
                });
            }
        },
    });
};
