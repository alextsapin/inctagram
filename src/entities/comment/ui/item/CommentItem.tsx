import type { ReactNode } from 'react';

import { formatRelativeTime } from '@/shared/lib';
import { Avatar } from '@/shared/ui/avatar';

import type { CommentType } from '../../model/type';

import s from './comment-item.module.scss';

type Props = {
    comment: CommentType;
    actionsSlot?: ReactNode;
    onReply?: (commentId: string) => void;
};

export const CommentItem = ({
    comment,
    actionsSlot,
    onReply,
}: Props): React.JSX.Element => {
    const { id, author, text, createdAt, likesCount } = comment;

    return (
        <article className={s.item}>
            <Avatar src={author.avatarUrl} alt="" size={36} />

            <div className={s.wrapper}>
                <div className={s.content}>
                    <p className={s.text}>
                        <span className={s.username}>{author.username} </span>
                        {text}
                    </p>

                    {actionsSlot && <div>{actionsSlot} </div>}
                </div>
                <div className={s.meta}>
                    <time dateTime={createdAt} suppressHydrationWarning>
                        {formatRelativeTime(createdAt)}{' '}
                    </time>

                    {likesCount > 0 && <span> Like: {likesCount}</span>}

                    {onReply && (
                        <button
                            type="button"
                            className={s.reply}
                            onClick={() => {
                                onReply(id);
                            }}
                        >
                            Answer
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};
