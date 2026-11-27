import type { QueryClient } from '@tanstack/react-query';

import { postQueryKeys } from '@/entities/post';
import { profileQueryKeys } from '@/entities/profile';
import { currentUserQueryKey, type Me } from '@/entities/session';

// Инвалидация после смены аватара (загрузка или удаление). Набор ключей тот же,
// что в useUpdateProfile при смене avatar: /me, профиль текущего пользователя
// и все посты — avatar автора лежит внутри каждого поста в кэше.
// Возвращает промис, чтобы мутация завершалась только после перезапроса данных.
export const invalidateAvatarCaches = (queryClient: QueryClient): Promise<void> => {
    // Username берём из кэша /me: ключ профиля строится по username, а не по uid
    const username = queryClient.getQueryData<Me>(currentUserQueryKey)?.username;

    const profileKey =
        username === undefined ? profileQueryKeys.all : profileQueryKeys.detail(username);

    return Promise.all([
        queryClient.invalidateQueries({ queryKey: currentUserQueryKey }),
        queryClient.invalidateQueries({ queryKey: profileKey }),
        queryClient.invalidateQueries({ queryKey: postQueryKeys.all }),
    ]).then(() => undefined);
};
