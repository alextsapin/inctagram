import type { ReactNode } from 'react';

import type { CommentType } from '@/entities/comment';
import { CommentThread } from '@/entities/comment';
import { MOCK_COMMENTS } from '@/entities/post';

import s from './commentsSection.module.scss';

type Props = {
    postId: string;
    renderActions?: (comment: CommentType) => ReactNode;
    onReply?: (commentId: string) => void;
};

export const CommentsSection = ({
    postId,
    renderActions,
    onReply,
}: Props): React.JSX.Element => {
    // TODO   Запрос за комментами по ip

    const comments = MOCK_COMMENTS.filter(c => c.postId === postId);

    if (comments.length === 0) {
        return <div className={s.empty}>Пока нет комментариев. Будь первым!</div>;
    }

    return (
        <ul className={s.list}>
            {comments.map(comment => (
                <li key={comment.id}>
                    <CommentThread
                        comment={comment}
                        renderActions={renderActions}
                        onReply={onReply}
                    />
                </li>
            ))}
        </ul>
    );
};
