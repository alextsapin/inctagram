'use client';

import { useState } from 'react';

import { Carousel, MOCK_POSTS, PostCaption, PostHeader, PostMeta } from '@/entities/post';
import { PostMenu } from '@/entities/post/ui/post-menu';
import { AddCommentForm } from '@/features/add-comment';
import { DeletePostModal } from '@/features/delete-post';
import { LikeCommentButton } from '@/features/like-comment';
import { LikePostButton } from '@/features/like-post';
import { SavePostButton } from '@/features/save-post';
import { SharePostButton } from '@/features/share-post';
import { CommentsSection } from '@/features/view-comments';

import s from './post-viewer.module.scss';

type Props = {
    postId: string;
    onEdit?: () => void;
    onDeleted?: () => void;
    onLikesClick?: () => void;
};
export const PostViewer = ({
    postId,
    onEdit,
    onDeleted,
    onLikesClick,
}: Props): React.JSX.Element => {
    //  на какой комментарий мы сейчас отвечаем
    //  null  -  если мы просто пишем коммент, а не отвечаем
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const data = MOCK_POSTS.find(post => post.id === postId);

    if (!data) {
        return <div>Пост не найден</div>;
    }
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
    } = data;

    const currentUser = {
        id: 'user-1',
        username: 'artem_dev',
        avatarUrl: '/images/avatars/artem.jpg',
    };

    const isOwnPost = currentUser?.id === author.id;

    const handleDeleteConfirm = (): void => {
        // В будущем муатция удаления

        setIsDeleteModalOpen(false);
        onDeleted?.();
    };

    return (
        <div className={s.wrapper}>
            <div className={s.content}>
                <div className={s['carousel-wrapper']}>
                    <Carousel slides={images} />
                </div>
                <div className={s.sidebar}>
                    <div className={s.header}>
                        <PostHeader
                            size={36}
                            actionSlot={
                                <PostMenu
                                    postId={id}
                                    isOwnPost={isOwnPost}
                                    isFollow={false}
                                    onEdit={onEdit}
                                    onDelete={() => setIsDeleteModalOpen(true)}
                                />
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
                            onReply={id => setReplyToId(id)}
                            postId={postId}
                            renderActions={comment => (
                                <LikeCommentButton
                                    commentId={comment.id}
                                    isLiked={comment.isLiked}
                                />
                            )}
                        />
                    </div>
                    <div className={s.footer}>
                        <div className={s['actions-panel']}>
                            <div className={s['left-actions']}>
                                <LikePostButton postId={id} isLiked={isLiked} />
                                <SharePostButton postId={id} />
                            </div>
                            <SavePostButton postId={id} isSaved={isSaved} />
                        </div>
                        <div className={s.meta}>
                            <PostMeta
                                likedBy={likedBy}
                                likesCount={likesCount}
                                createdAt={createdAt}
                                onLikesClick={onLikesClick}
                                size={36}
                            />
                        </div>
                        <div className={s['form-wrapper']}>
                            <AddCommentForm
                                // Пробрасываем id поста и id комментария
                                postId={postId}
                                replyToId={replyToId}
                                // функция сброса в форму
                                onCancelReply={() => setReplyToId(null)}
                                // После успешной отправки сбрасываем replyToId
                                onSuccess={() => setReplyToId(null)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DeletePostModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};
