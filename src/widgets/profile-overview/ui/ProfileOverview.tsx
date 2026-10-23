import type { ReactNode } from 'react';

import Image from 'next/image';

import css from './profile-overview.module.scss';

const AVATAR_SIZE = 204;

type ProfileOverviewProps = {
    username: string;
    actions?: ReactNode;
    description?: ReactNode;
    stats?: ReactNode;
};

export const ProfileOverview = ({
    username,
    actions,
    description,
    stats,
}: ProfileOverviewProps): React.JSX.Element => {
    return (
        <section className={css.info}>
            <div className={css.avatar}>
                <Image
                    src="/profile/avatar.png"
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
