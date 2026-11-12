'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
    Carousel,
    Post,
    PostCaption,
    PostHeader,
    PostMenu,
    PostMeta,
} from '@/entities/post';
import { useCurrentUser } from '@/entities/session';
import { AddCommentForm } from '@/features/add-comment';
import { LikeCommentButton } from '@/features/like-comment';
import { LikePostButton } from '@/features/like-post';
import { SavePostButton } from '@/features/save-post';
import { SharePostButton } from '@/features/share-post';
import { CommentsSection } from '@/features/view-comments';
import { IconButton } from '@/shared/ui/icon-button';
import { CommentIcon } from '@/shared/ui/icons';

import s from './post-feed.module.scss';

type Props = {
    post: Post;
    onDeleteClick: () => void;
    onEditClick: () => void;
    onLikesClick: () => void;
};

export const PostFeed = ({
    post,
    onDeleteClick,
    onEditClick,
    onLikesClick,
}: Props): React.JSX.Element => {
    const {
        id,
        author,
        images,
        isLiked,
        isSaved,
        likedBy,
        likesCount,
        commentsCount,
        createdAt,
        caption,
    } = post;

    const [isShow, setIsShow] = useState(false);
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const { data: currentUser } = useCurrentUser();
    const isOwnPost = currentUser?.userId === author.id;

    const handleCommentClick = (): void => {
        // 1. Если комменты скрыты, раскрываем их
        if (!isShow) setIsShow(true);

        // 2. Фокусируемся на инпуте (с небольшой задержкой, чтобы DOM успел обновиться)
        setTimeout(() => {
            const input = document.getElementById(`comment-input-${id}`);

            if (input) input.focus();
            // eslint-disable-next-line no-magic-numbers
        }, 50);
    };

    return (
        <article>
            <div className={s.header}>
                <PostHeader
                    author={author}
                    size={32}
                    subtext={createdAt}
                    actionSlot={
                        <PostMenu
                            onEdit={onEditClick}
                            postId={id}
                            isOwnPost={isOwnPost}
                            isFollow={author.isFollowing ?? false}
                            onDelete={onDeleteClick}
                        />
                    }
                />
            </div>
            <Link
                href={`/post/${id}`}
                className={s['carousel-wrapper']}
                onClick={e => {
                    // Игнорируем клик, если нажали на кнопку (стрелки, точки)
                    if ((e.target as HTMLElement).closest('button')) {
                        e.preventDefault();
                    }
                }}
            >
                <Carousel slides={images} />
            </Link>
            <div className={s['actions-panel']}>
                <div className={s['left-actions']}>
                    <LikePostButton postId={id} isLiked={isLiked} />
                    <IconButton
                        size={24}
                        type="button"
                        onClick={handleCommentClick}
                        label="Comment"
                    >
                        <CommentIcon />
                    </IconButton>
                    <SharePostButton postId={id} />
                </div>
                <SavePostButton postId={id} isSaved={isSaved} />
            </div>
            <div className={s.caption}>
                <PostCaption author={author} caption={caption || ''} />
            </div>
            <div className={s['meta-wrapper']}>
                <PostMeta
                    likedBy={likedBy}
                    likesCount={likesCount}
                    size={24}
                    onLikesClick={onLikesClick}
                />
            </div>

            {commentsCount > 0 && (
                <button
                    type="button"
                    className={s['view-comments']}
                    onClick={() => setIsShow(prev => !prev)}
                >
                    View All Comments ({commentsCount})
                </button>
            )}
            {isShow && (
                <CommentsSection
                    onReply={commentId => setReplyToId(commentId)}
                    postId={id}
                    renderActions={comment => (
                        <LikeCommentButton
                            commentId={comment.id}
                            isLiked={comment.isLiked}
                        />
                    )}
                />
            )}
            <div className={s.forma}>
                <AddCommentForm
                    // Пробрасываем id поста и id комментария
                    postId={id}
                    // функция сброса в форму
                    replyToId={replyToId}
                    onCancelReply={() => setReplyToId(null)}
                    onSuccess={() => setReplyToId(null)}
                />
            </div>
        </article>
    );
};
