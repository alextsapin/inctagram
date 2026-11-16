'use client';

import type { ReactNode } from 'react';

import { InfinitePostGrid } from '@/entities/post';
import { profileApi } from '@/entities/profile';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileLayout } from '@/widgets/profile-layout';

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
    const profile = profileApi.getUserProfile(username);

    const formatNumber = (value: number): string =>
        value.toLocaleString('en-US').replace(/,/g, ' ');

    const verified = isVerified ?? profile.isVerified;
    const avatar = avatarUrl ?? profile.avatarUrl;

    return (
        <ProfileLayout withSidebar={withSidebar}>
            {/* Шапка и посты в одной обёртке: блок не шире макета и стоит по центру,
                и рядом с сайдбаром, и на всю ширину страницы у гостя */}
            <div className={css.content}>
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

                <InfinitePostGrid username={username} />
            </div>
        </ProfileLayout>
    );
};
