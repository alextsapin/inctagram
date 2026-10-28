'use client';

import { useState } from 'react';

import type { CommentType } from '../../model/type';
import { CommentItem } from '../item';

import s from './comment-thread.module.scss';

type Props = {
    comment: CommentType;
    renderActions?: (comment: CommentType) => React.ReactNode;
    onReply?: (commentId: string) => void;
};

export const CommentThread = ({
    comment,
    renderActions,
    onReply,
}: Props): React.JSX.Element => {
    const [isShowed, setIsShowed] = useState(false);

    const replies = comment.replies ?? [];
    const hasReplies = replies.length > 0;

    return (
        <div className={s.thread}>
            <CommentItem
                comment={comment}
                actionsSlot={renderActions?.(comment)}
                onReply={onReply}
            />
            {hasReplies && (
                <button
                    type="button"
                    className={s['toggle-btn']}
                    onClick={() => setIsShowed(prev => !prev)}
                >
                    <span className={s.line} />
                    {isShowed ? 'Hide' : 'View'} Answers ({comment.replies?.length})
                </button>
            )}
            {hasReplies && isShowed && (
                <div className={s.replies}>
                    {replies.map(reply => (
                        <CommentItem
                            onReply={onReply}
                            key={reply.id}
                            comment={reply}
                            actionsSlot={renderActions?.(reply)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
