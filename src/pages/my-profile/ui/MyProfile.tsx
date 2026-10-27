'use client';

import type { JSX } from 'react';

import Link from 'next/link';

import { useCurrentUser } from '@/entities/session';
import { ProfilePage } from '@/pages/profile';

import css from './my-profile.module.scss';

type MyProfileProps = {
    // Переопределяет флаг верификации. Если не передан, берётся из данных пользователя.
    isVerified?: boolean;
};

export const MyProfile = ({ isVerified }: MyProfileProps = {}): JSX.Element => {
    const { data: user, isPending, isError } = useCurrentUser();

    if (isPending) {
        return (
            <p className={css.message} role="status">
                Loading profile…
            </p>
        );
    }

    if (isError || !user) {
        return (
            <p className={css.message} role="alert">
                Failed to load profile. Please sign in and try again.
            </p>
        );
    }

    return (
        <ProfilePage
            username={user.username}
            avatarUrl="/profile/avatar.png"
            isVerified={isVerified ?? user.isVerified}
            actions={
                <Link href="/profile/settings" className={css['settings-link']}>
                    Profile Settings
                </Link>
            }
        />
    );
};
