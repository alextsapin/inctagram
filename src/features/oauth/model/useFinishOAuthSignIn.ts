import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { getMe } from '@/entities/session';
import { refreshAccessToken } from '@/shared/api';

// Пользователь вернулся с Google или GitHub. Бэкенд уже поставил cookie с refresh-токеном:
// по ней получаем access-токен, узнаём username и переходим в профиль
export const useFinishOAuthSignIn = (): void => {
    const router = useRouter();

    useEffect(() => {
        const finishSignIn = async (): Promise<void> => {
            try {
                const token = await refreshAccessToken();

                // Cookie нет или она недействительна: вход не удался
                if (!token) {
                    router.replace('/auth/oauth/failure');

                    return;
                }

                const me = await getMe();

                // replace, а не push: кнопка «Назад» не вернёт на эту служебную страницу
                router.replace(`/profile/${me.username}`);
            } catch {
                router.replace('/auth/oauth/failure');
            }
        };

        finishSignIn();
    }, [router]);
};
