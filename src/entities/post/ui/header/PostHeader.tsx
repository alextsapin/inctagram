import type { ReactNode } from 'react';

import { formatRelativeTime } from '@/shared/lib';
import { Avatar } from '@/shared/ui/avatar';

import { User } from '../../model/type';

import s from './post-header.module.scss';

type Props = {
    author: User;
    size?: number;
    actionSlot?: ReactNode;
    subtext?: string;
};

export const PostHeader = ({
    author,
    size,
    actionSlot,
    subtext,
}: Props): React.JSX.Element => {
    return (
        <div className={s.header}>
            <div className={s.author}>
                <Avatar src={author.avatarUrl} alt="" size={size} />
                <span>{author.username}</span>

                {subtext && (
                    <div>
                        <span className={s.dot}>•</span>
                        <span className={s.subtext}>{formatRelativeTime(subtext)}</span>
                    </div>
                )}
            </div>

            {actionSlot}
        </div>
    );
};
