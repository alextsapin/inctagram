'use client';

import type { ReactNode } from 'react';

import { InfinitePostGrid } from '@/entities/post';
import { useProfile } from '@/entities/profile';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileLayout } from '@/widgets/profile-layout';

import css from './profile-page.module.scss';

type ProfilePageProps = {
    username: string;
    isVerified?: boolean;
    withSidebar?: boolean;
    actions?: ReactNode;
};

export const ProfilePage = ({
    username,
    isVerified,
    withSidebar = false,
    actions,
}: ProfilePageProps): React.JSX.Element | null => {
    const {
        data: profile,
        isPending,
        isError,
        isNotFound,
        refetch,
    } = useProfile(username);

    const formatNumber = (value: number): string =>
        value.toLocaleString('en-US').replace(/,/g, ' ');

    // «Такого профиля нет»: username не существует. Показываем целиком отдельное
    // состояние, а не шапку с ошибкой и сетку постов рядом — два независимых запроса
    // (профиль + посты) не должны показывать противоречивые состояния одновременно.
    if (isNotFound) {
        return (
            <ProfileLayout withSidebar={withSidebar}>
                <div className={css.notFound} role="alert">
                    <h2 className={css['not-found-title']}>Profile not found</h2>
                    <p className={css['not-found-text']}>
                        User &quot;{username}&quot; doesn&apos;t exist.
                    </p>
                </div>
            </ProfileLayout>
        );
    }

    // Первичная загрузка шапки: skeleton на месте фото+username+About me,
    // не весь экран, потому что посты загружаются параллельно.
    if (isPending) {
        return (
            <ProfileLayout withSidebar={withSidebar}>
                <div className={css.content}>
                    <ProfileHeaderSkeleton />
                    <InfinitePostGrid username={username} />
                </div>
            </ProfileLayout>
        );
    }

    // Ошибка запроса профиля (не «профиль не найден»): явное сообщение + Retry.
    // Посты в этом случае не показываем, чтобы не смешивать две ошибки.
    if (isError) {
        return (
            <ProfileLayout withSidebar={withSidebar}>
                <div className={css.content}>
                    <div className={css.error} role="alert">
                        Failed to load profile.
                        <button
                            type="button"
                            className={css['error-retry']}
                            onClick={() => {
                                refetch();
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    if (!profile) {
        // Теоретически недостижимо после isPending/isError/isNotFound: useQuery
        // в этом случае вернул бы data. Оставлено для типизации (profile: Profile).
        return null;
    }

    const verified = isVerified ?? false;
    // Аватар с сервера; локальная картинка — только fallback.
    const avatar = profile.avatar ?? '/profile/avatar.png';

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
                            {/* Following: subscriptions — заглушка бэкенда (только сам
                                пользователь), поэтому реального числа подписок нет. */}
                            <div className={css.stat}>
                                <span className={css['stat-value']}>—</span>
                                <span className={css['stat-label']}>Following</span>
                            </div>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>
                                    {formatNumber(profile.followers)}
                                </span>
                                <span className={css['stat-label']}>Followers</span>
                            </div>
                            <div className={css.stat}>
                                <span className={css['stat-value']}>
                                    {formatNumber(profile.publications)}
                                </span>
                                <span className={css['stat-label']}>Publications</span>
                            </div>
                        </>
                    }
                    description={profile.description}
                />

                <InfinitePostGrid username={username} />
            </div>
        </ProfileLayout>
    );
};

// Скелетон шапки: фото+username+About me в виде пульсирующих блоков.
const ProfileHeaderSkeleton = (): React.JSX.Element => (
    <div className={css.skeleton} role="status" aria-label="Loading profile">
        <div className={css['skeleton-avatar']} />
        <div className={css['skeleton-content']}>
            <div className={css['skeleton-name']} />
            <div className={css['skeleton-stats']} />
            <div className={css['skeleton-description']} />
        </div>
    </div>
);
