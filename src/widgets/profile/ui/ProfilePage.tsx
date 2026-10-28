'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileLayout } from '@/widgets/profile-layout';

import { profileApi } from '@/entities/profile';
import type { Post } from '@/entities/profile';

import { PostModal } from './PostModal';
import { PostsGrid } from './PostsGrid';
import css from './profile-page.module.scss';

type ProfilePageProps = {
    username: string;
    avatarUrl?: string;
    isVerified?: boolean;
    withSidebar?: boolean;
    actions?: ReactNode;
};

export const ProfilePage = ({
    username,
    avatarUrl,
    isVerified,
    withSidebar = false,
    actions,
}: ProfilePageProps): React.JSX.Element => {
    const [activePost, setActivePost] = useState<Post | null>(null);
    const [isPostOpen, setIsPostOpen] = useState(false);

    const profile = profileApi.getUserProfile(username);
    const posts = profileApi.getPosts();

    const formatNumber = (value: number): string =>
        value.toLocaleString('en-US').replace(/,/g, ' ');

    const verified = isVerified ?? profile.isVerified;
    const avatar = avatarUrl ?? profile.avatarUrl;

    const handlePostClick = (post: Post): void => {
        setActivePost(post);
        setIsPostOpen(true);
    };

    const handleClose = (): void => {
        setIsPostOpen(false);
        setActivePost(null);
    };

    return (
        <ProfileLayout withSidebar={withSidebar}>
            <ProfileHeader
                username={profile.username}
                avatarUrl={avatar}
                isVerified={verified}
                actions={actions}
                stats={
                    <>
                        <div className={css.stat}>
                            <span className={css['stat-value']}>
                                {formatNumber(profile.stats.following)}
                            </span>
                            <span className={css['stat-label']}>Following</span>
                        </div>
                        <div className={css.stat}>
                            <span className={css['stat-value']}>
                                {formatNumber(profile.stats.followers)}
                            </span>
                            <span className={css['stat-label']}>Followers</span>
                        </div>
                        <div className={css.stat}>
                            <span className={css['stat-value']}>
                                {formatNumber(profile.stats.publications)}
                            </span>
                            <span className={css['stat-label']}>Publications</span>
                        </div>
                    </>
                }
                description={profile.aboutMe}
            />

            <PostsGrid posts={posts} onPostClick={handlePostClick} />

            <PostModal open={isPostOpen} post={activePost} onClose={handleClose} />
        </ProfileLayout>
    );
};
