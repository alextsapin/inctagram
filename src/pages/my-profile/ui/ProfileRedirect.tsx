'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/entities/session';

import css from './my-profile.module.scss';

// /profile — служебный маршрут без собственного содержимого:
// авторизованного пользователя отправляем в его профиль, гостя — на главную.
export const ProfileRedirect = (): React.JSX.Element => {
    const router = useRouter();
    const { data: user, isPending } = useCurrentUser();
    const username = user?.username;

    useEffect(() => {
        if (isPending) {
            return;
        }

        router.replace(username ? `/profile/${username}` : '/');
    }, [isPending, username, router]);

    return (
        <p className={css.message} role="status">
            Loading profile…
        </p>
    );
};
