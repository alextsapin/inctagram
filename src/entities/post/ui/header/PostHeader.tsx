import type { ReactNode } from 'react';

import { Avatar } from '@/shared/ui/avatar';

import { User } from '../../model/type';

import s from './postHeader.module.scss';

type Props = {
    author: User;
    size?: number;
    actionSlot?: ReactNode;
};

export const PostHeader = ({ author, size, actionSlot }: Props): React.JSX.Element => {
    return (
        <div className={s.header}>
            <div className={s.author}>
                <Avatar src={author.avatarUrl} alt="" size={size} />
                <span>{author.username}</span>
            </div>
            {actionSlot}
        </div>
    );
};
