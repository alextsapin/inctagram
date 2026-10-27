'use client';

import type { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useCurrentUser } from '@/entities/session';
import { ProfileOverview } from '@/widgets/profile-overview';
import { Sidebar } from '@/widgets/sidebar';

import css from './my-profile.module.scss';

// Временные данные для вёрстки. Значения будут браться из API,
// когда появятся соответствующие endpoints (статистика и публикации профиля).
const MOCK_POSTS = [
    '/profile/post-1.png',
    '/profile/post-2.png',
    '/profile/post-3.png',
    '/profile/post-4.png',
    '/profile/post-5.png',
    '/profile/post-6.png',
    '/profile/post-7.png',
    '/profile/post-8.png',
];

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
                    <>
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
                            stats={
                                <>
                                    <div className={css.stat}>
                                        <span className={css['stat-value']}>0</span>
                                        <span className={css['stat-label']}>
                                            Following
                                        </span>
                                    </div>
                                    <div className={css.stat}>
                                        <span className={css['stat-value']}>0</span>
                                        <span className={css['stat-label']}>
                                            Followers
                                        </span>
                                    </div>
                                    <div className={css.stat}>
                                        <span className={css['stat-value']}>
                                            {MOCK_POSTS.length}
                                        </span>
                                        <span className={css['stat-label']}>
                                            Publications
                                        </span>
                                    </div>
                                </>
                            }
                        />

                        <section className={css.grid} aria-label="Publications">
                            {MOCK_POSTS.map(src => (
                                <div key={src} className={css.post}>
                                    <Image
                                        src={src}
                                        alt="publication"
                                        fill
                                        className={css.image}
                                        sizes="(max-width: 768px) 50vw, (max-width: 1160px) 33vw, 234px"
                                    />
                                </div>
                            ))}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};
