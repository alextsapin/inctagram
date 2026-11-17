'use client';

import { useEffect } from 'react';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/entities/session';
import { Button } from '@/shared/ui/button';

import css from './my-profile.module.scss';

const UNAUTHORIZED = 401;

// /profile — служебный маршрут без собственного содержимого: авторизованного
// пользователя отправляем в его профиль, гостя — на главную.
export const ProfileRedirect = (): React.JSX.Element => {
    const router = useRouter();
    const { data: user, isPending, isError, error, refetch } = useCurrentUser();

    // 401 — сессии нет, это гость. Любая другая ошибка (500, сеть) не означает
    // «гость»: уводить авторизованного пользователя на главную в этом случае нельзя.
    const isUnauthorized = isAxiosError(error) && error.response?.status === UNAUTHORIZED;
    const username = user?.username;

    useEffect(() => {
        if (isPending || (isError && !isUnauthorized)) {
            return;
        }

        router.replace(username ? `/profile/${encodeURIComponent(username)}` : '/');
    }, [isPending, isError, isUnauthorized, username, router]);

    if (isError && !isUnauthorized) {
        return (
            <div className={css.message} role="alert">
                Failed to load profile.
                <Button
                    onClick={() => {
                        refetch();
                    }}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <p className={css.message} role="status">
            Loading profile…
        </p>
    );
};
