'use client';

import type { JSX } from 'react';

import Link from 'next/link';

import { useCurrentUser } from '@/entities/session';
import { ProfileOverview } from '@/widgets/profile-overview';
import { Sidebar } from '@/widgets/sidebar';

import css from './my-profile.module.scss';

export const MyProfile = (): JSX.Element => {
    const { data: user, isPending, isError } = useCurrentUser();

    return (
        <div className={css.layout}>
            <Sidebar />

            <main className={css.profile}>
                {isPending && (
                    <p className={css.message} role="status">
                        Loading profile…
                    </p>
                )}

                {isError && (
                    <p className={css.message} role="alert">
                        Failed to load profile. Please sign in and try again.
                    </p>
                )}

                {user && (
                    <ProfileOverview
                        username={user.username}
                        actions={
                            <Link
                                href="/profile/settings"
                                className={css['settings-link']}
                            >
                                Profile Settings
                            </Link>
                        }
                    />
                )}
            </main>
        </div>
    );
};
