'use client';

import {
    useMutation,
    type UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query';

import { postQueryKeys } from '@/entities/post';
import { profileApi, profileQueryKeys, type UpdateProfileDto } from '@/entities/profile';
import { currentUserQueryKey, type Me } from '@/entities/session';

/**
 * Сохраняет профиль через `PUT /api/v1/profile`.
 *
 * Принимает только изменённые поля `UpdateProfileDto` (`mutate(data)`).
 * Username до сохранения хук читает из кэша `/me` в момент вызова мутации:
 * по нему удаляется старый ключ профиля при смене username.
 *
 * При успехе инвалидирует `/me`, профиль и все посты. При ошибке пробрасывает
 * исходную ошибку axios — для текста и раскладки по полям используй
 * `normalizeProfileError` из `@/entities/profile`.
 *
 * Имена полей ответа бэкенда не совпадают с именами полей формы: `description`
 * на бэкенде — это `aboutMe` в форме. Соответствие полей настраивает задача 7;
 * хук эту таблицу не задаёт.
 */
export const useUpdateProfile = (): UseMutationResult<
    string | undefined,
    Error,
    UpdateProfileDto
> => {
    const queryClient = useQueryClient();

    return useMutation({
        // Username читаем здесь, а не на рендере: к моменту вызова /me уже
        // загружен, а кэш мог обновиться после рендера компонента.
        mutationFn: async (data: UpdateProfileDto) => {
            const oldUsername =
                queryClient.getQueryData<Me>(currentUserQueryKey)?.username;

            await profileApi.updateProfile(data);

            return oldUsername;
        },

        onSuccess: (oldUsername, data) => {
            // 1. /me: username в шапке, сайдбаре и других местах.
            queryClient.invalidateQueries({ queryKey: currentUserQueryKey });

            // 2. Профиль. При смене username старый ключ удаляем, а не
            // инвалидируем: иначе браузер запросит старый username и получит 404.
            if (oldUsername === undefined) {
                // На странице настроек /me уже загружен, поэтому сюда попадать
                // не должны. Чистить нечего: ключа старого username ещё нет.
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.warn(
                        '[useUpdateProfile] /me is not in cache: skip removing the old profile key',
                    );
                }

                queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
            } else {
                const nextUsername = data.username ?? oldUsername;

                if (nextUsername !== oldUsername) {
                    queryClient.removeQueries({
                        queryKey: profileQueryKeys.detail(oldUsername),
                    });
                    queryClient.invalidateQueries({
                        queryKey: profileQueryKeys.detail(nextUsername),
                    });
                } else {
                    queryClient.invalidateQueries({
                        queryKey: profileQueryKeys.detail(oldUsername),
                    });
                }
            }

            // 3. Посты: username/avatar автора лежат внутри каждого поста в кэше,
            // включая postQueryKeys.detail(id). Точечно инвалидировать посты
            // пользователя нельзя без знания id, поэтому инвалидируем все.
            queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
        },
    });
};
