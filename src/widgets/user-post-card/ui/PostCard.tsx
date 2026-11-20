'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Carousel, type PostImage } from '@/entities/post';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';

import styles from './user-post-card.module.scss';

const INITIAL_TEXT_LENGTH = 100;
const EXPANDED_TEXT_LENGTH = 225;

type PostCardProps = {
    postId: string;
    username?: string;
    postText?: string;
    createdAt: string;
    images: PostImage[];
    authorAvatar: string;
};

const TIME_REFRESH_MS = 60_000;

export const PostCard = ({
    postId,
    username,
    postText,
    createdAt,
    images,
    authorAvatar,
}: PostCardProps): React.JSX.Element => {
    const [isExpanded, setIsExpanded] = useState(false);

    const [relativeTime, setRelativeTime] = useState('');

    useEffect(() => {
        const updateTime = (): void => {
            setRelativeTime(formatRelativeTime(createdAt));
        };

        const timeout = window.setTimeout(updateTime, 0);
        const interval = window.setInterval(updateTime, TIME_REFRESH_MS);

        return () => {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
        };
    }, [createdAt]);

    const text = postText ?? '';
    const textLimit = isExpanded ? EXPANDED_TEXT_LENGTH : INITIAL_TEXT_LENGTH;
    const visibleText = text.slice(0, textLimit);
    const isTextTruncated = text.length > textLimit;

    return (
        <article className={styles.card}>
            <Link
                href={`/post/${postId}`}
                className={styles.link}
                onClick={e => {
                    // Игнорируем клик, если нажали на кнопку (стрелки, точки)
                    if ((e.target as HTMLElement).closest('button')) {
                        e.preventDefault();
                    }
                }}
            >
                <div
                    className={`${styles['carousel-wrapper']} ${
                        isExpanded ? styles['carousel-wrapper-expanded'] : ''
                    }`}
                >
                    <Carousel slides={images} />
                </div>
            </Link>
            <div className={styles.author}>
                <div className={styles['author-avatar-wrapper']}>
                    <Image
                        className={styles['author-avatar']}
                        src={authorAvatar}
                        alt={`${username} avatar`}
                        fill
                        sizes="36px"
                    />
                </div>
                <h3 className={styles['author-name']}>{username}</h3>
            </div>
            <div>
                <time dateTime={createdAt} className={styles['published-at']}>
                    {relativeTime}
                </time>

                <p className={styles['post-text']}>
                    {visibleText}
                    {isTextTruncated && '...'}{' '}
                    {text.length > INITIAL_TEXT_LENGTH && (
                        <button
                            type="button"
                            className={styles['text-toggle']}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Hide' : 'Show more'}
                        </button>
                    )}
                </p>
            </div>
        </article>
    );
};
