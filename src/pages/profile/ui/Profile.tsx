import type { JSX } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { Sidebar } from '@/widgets/sidebar';

import css from './profile.module.scss';

type ProfileProps = {
    username: string;
};

const POSTS = [
    { src: '/profile/post-1.png', alt: 'post 1' },
    { src: '/profile/post-2.png', alt: 'post 2' },
    { src: '/profile/post-3.png', alt: 'post 3' },
    { src: '/profile/post-4.png', alt: 'post 4' },
    { src: '/profile/post-5.png', alt: 'post 5' },
    { src: '/profile/post-6.png', alt: 'post 6' },
    { src: '/profile/post-7.png', alt: 'post 7' },
    { src: '/profile/post-8.png', alt: 'post 8' },
];

export const Profile = ({ username }: ProfileProps): JSX.Element => {
    return (
        <div className={css.layout}>
            <Sidebar />

            <main className={css.profile}>
                <section className={css.info}>
                    <div className={css.avatar}>
                        <Image
                            src="/profile/avatar.png"
                            alt={`${username} avatar`} // П.5: Информативный alt
                            width={204}
                            height={204}
                        />
                    </div>

                    <div className={css.content}>
                        <div className={css['name-row']}>
                            <h1 className={css.name}>{username}</h1>
                            <div className={css.actions}>
                                <Button>Follow</Button>
                                <Button variant="secondary">Send Message</Button>
                            </div>
                        </div>

                        <div className={css.stats}>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>2 218</span>
                                <span className={css['stat-label']}>Following</span>
                            </div>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>2 358</span>
                                <span className={css['stat-label']}>Followers</span>
                            </div>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>2 764</span>
                                <span className={css['stat-label']}>Publications</span>
                            </div>
                        </div>

                        <p className={css.description}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo{' '}
                            <Link href="/search?tag=consequat" className={css.link}>
                                consequat
                            </Link>
                            .
                        </p>
                    </div>
                </section>

                <section className={css.grid}>
                    {POSTS.map(post => (
                        <div key={post.src} className={css.post}>
                            <Image
                                src={post.src}
                                alt={post.alt}
                                fill
                                className={css.image}
                                // П.9: Пересчитанный sizes под новую адаптивную сетку
                                sizes="(max-width: 768px) 50vw, (max-width: 1160px) 33vw, 234px"
                            />
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};
