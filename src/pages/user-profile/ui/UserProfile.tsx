import type { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { ProfileOverview } from '@/widgets/profile-overview';
import { Sidebar } from '@/widgets/sidebar';

import css from './user-profile.module.scss';

type UserProfileProps = {
    username: string;
};

// Временные данные для вёрстки. Будут заменены на данные из API,
// когда появится endpoint получения профиля пользователя по username.
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

const MOCK_STATS = {
    following: '2 218',
    followers: '2 358',
    publications: '2 764',
};

const MOCK_DESCRIPTION =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
    'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.';

export const UserProfile = ({ username }: UserProfileProps): JSX.Element => {
    return (
        <div className={css.layout}>
            <Sidebar />

            <main className={css.profile}>
                <ProfileOverview
                    username={username}
                    actions={
                        <>
                            <Button>Follow</Button>
                            <Button variant="secondary">Send Message</Button>
                        </>
                    }
                    stats={
                        <>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>
                                    {MOCK_STATS.following}
                                </span>
                                <span className={css['stat-label']}>Following</span>
                            </div>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>
                                    {MOCK_STATS.followers}
                                </span>
                                <span className={css['stat-label']}>Followers</span>
                            </div>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>
                                    {MOCK_STATS.publications}
                                </span>
                                <span className={css['stat-label']}>Publications</span>
                            </div>
                        </>
                    }
                    description={
                        <>
                            {MOCK_DESCRIPTION}{' '}
                            <Link href="/search?tag=consequat" className={css.link}>
                                consequat
                            </Link>
                            .
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
            </main>
        </div>
    );
};
