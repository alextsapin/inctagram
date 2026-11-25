import type { QueryClient } from '@tanstack/react-query';

import { postQueryKeys } from '@/entities/post';
import { profileQueryKeys } from '@/entities/profile';
import { currentUserQueryKey, type Me } from '@/entities/session';

// Инвалидация после смены аватара (загрузка или удаление). Набор ключей тот же,
// что в useUpdateProfile при смене avatar: /me, профиль текущего пользователя
// и все посты — avatar автора лежит внутри каждого поста в кэше.
export const invalidateAvatarCaches = (queryClient: QueryClient): void => {
    queryClient.invalidateQueries({ queryKey: currentUserQueryKey });

    // Username берём из кэша /me: ключ профиля строится по username, а не по uid
    const username = queryClient.getQueryData<Me>(currentUserQueryKey)?.username;

    if (username === undefined) {
        queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
    } else {
        queryClient.invalidateQueries({
            queryKey: profileQueryKeys.detail(username),
        });
    }

    queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
};
