'use client';

import { useCallback, useState } from 'react';

import {
    Carousel,
    Post,
    PostCaption,
    PostHeader,
    PostMenu,
    PostMeta,
} from '@/entities/post';
import { AddCommentForm } from '@/features/add-comment';
import { DeletePostModal } from '@/features/delete-post';
import { LikeCommentButton } from '@/features/like-comment';
import { LikePostButton } from '@/features/like-post';
import { SavePostButton } from '@/features/save-post';
import { SharePostButton } from '@/features/share-post';
import { CommentsSection } from '@/features/view-comments';

import s from './post-viewer.module.scss';

type Props = {
    post: Post;
    onEdit?: () => void;
    onDeleted?: () => void;
    onLikesClick?: () => void;
    isAuthed: boolean;
    isOwnPost: boolean;
};
export const PostViewer = ({
    onEdit,
    onDeleted,
    onLikesClick,
    post,
    isAuthed,
    isOwnPost,
}: Props): React.JSX.Element => {
    //  на какой комментарий мы сейчас отвечаем
    //  null  -  если мы просто пишем коммент, а не отвечаем
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const {
        id,
        author,
        images,
        isLiked,
        isSaved,
        likedBy,
        likesCount,
        createdAt,
        caption,
    } = post;

    const handleDeleteFinished = (): void => {
        setIsDeleteModalOpen(false);
        onDeleted?.();
    };
    const handleReply = useCallback((commentId: string) => setReplyToId(commentId), []);
    const handleReplyReset = useCallback(() => setReplyToId(null), []);
    const renderCommentActions = useCallback(
        (comment: { id: string; isLiked: boolean }) => (
            <LikeCommentButton commentId={comment.id} isLiked={comment.isLiked} />
        ),
        [],
    );

    return (
        <section className={s.wrapper}>
            <div className={s.content}>
                <div className={s['carousel-wrapper']}>
                    <Carousel slides={images} />
                </div>
                <div className={s.sidebar}>
                    <div className={s.header}>
                        <PostHeader
                            size={36}
                            actionSlot={
                                isAuthed ? (
                                    <PostMenu
                                        isOwnPost={isOwnPost}
                                        isFollow={author.isFollowing ?? false}
                                        onEdit={onEdit}
                                        onDelete={() => setIsDeleteModalOpen(true)}
                                    />
                                ) : null
                            }
                            author={author}
                        />
                    </div>
                    <div className={s.comments}>
                        <div className={s.caption}>
                            <PostCaption
                                author={author}
                                createdAt={createdAt}
                                caption={caption || ''}
                            />
                        </div>

                        <CommentsSection
                            onReply={isAuthed ? handleReply : undefined}
                            postId={id}
                            renderActions={isAuthed ? renderCommentActions : undefined}
                        />
                    </div>
                    <div className={s.footer}>
                        {isAuthed && (
                            <div className={s['actions-panel']}>
                                <div className={s['left-actions']}>
                                    <LikePostButton postId={id} isLiked={isLiked} />
                                    <SharePostButton postId={id} />
                                </div>
                                <SavePostButton postId={id} isSaved={isSaved} />
                            </div>
                        )}
                        <div className={isAuthed ? s.meta : s['meta-guest']}>
                            <PostMeta
                                likedBy={likedBy}
                                likesCount={likesCount}
                                createdAt={createdAt}
                                onLikesClick={isAuthed ? onLikesClick : undefined}
                                size={36}
                            />
                        </div>
                        {isAuthed && (
                            <div className={s['form-wrapper']}>
                                <AddCommentForm
                                    // Пробрасываем id поста и id комментария
                                    postId={id}
                                    replyToId={replyToId}
                                    // функция сброса в форму
                                    onCancelReply={handleReplyReset}
                                    // После успешной отправки сбрасываем replyToId
                                    onSuccess={handleReplyReset}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isAuthed && isOwnPost && (
                <DeletePostModal
                    postId={id}
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeleted={handleDeleteFinished}
                />
            )}
        </section>
    );
};
