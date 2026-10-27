import type { ReactNode } from 'react';

import Image from 'next/image';

import css from './profile-header.module.scss';

const AVATAR_SIZE = 204;

type ProfileHeaderProps = {
    username: string;
    avatarUrl?: string;
    actions?: ReactNode;
    description?: ReactNode;
    stats?: ReactNode;
};

export const ProfileHeader = ({
    username,
    avatarUrl = '/profile/avatar.png',
    actions,
    description,
    stats,
}: ProfileHeaderProps): React.JSX.Element => {
    return (
        <section className={css.info}>
            <div className={css.avatar}>
                <Image
                    src={avatarUrl}
                    alt={`${username} avatar`}
                    width={AVATAR_SIZE}
                    height={AVATAR_SIZE}
                />
            </div>

            <div className={css.content}>
                <div className={css['name-row']}>
                    <h1 className={css.name}>{username}</h1>
                    {actions && <div className={css.actions}>{actions}</div>}
                </div>

                {stats && <div className={css.stats}>{stats}</div>}

                {description && <p className={css.description}>{description}</p>}
            </div>
        </section>
    );
};
