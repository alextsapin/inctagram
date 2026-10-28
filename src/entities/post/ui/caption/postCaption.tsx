import { formatRelativeTime } from '@/shared/lib';
import { Avatar } from '@/shared/ui/avatar';

import { User } from '../..';

import s from './post-caption.module.scss';

type Props = {
    caption: string;
    author: User;
    createdAt: string;
};

export const PostCaption = ({ caption, author, createdAt }: Props): React.JSX.Element => {
    return (
        <article className={s.item}>
            <Avatar src={author.avatarUrl} alt="" size={36} />
            <div className={s.wrapper}>
                <p className={s.text}>
                    <span className={s.username}>{author.username} </span>
                    {caption}
                </p>
                <div className={s.meta}>
                    <time dateTime={createdAt} suppressHydrationWarning>
                        {formatRelativeTime(createdAt)}
                    </time>
                </div>
            </div>
        </article>
    );
};
