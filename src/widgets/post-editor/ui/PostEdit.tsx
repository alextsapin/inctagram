'use client';

import Image from 'next/image';

import { Post } from '@/entities/post';
import { EditPostForm } from '@/features/edit-post';
import { Avatar } from '@/shared/ui/avatar';

import s from './post-edit.module.scss';

type Props = {
    post: Post;
    onDirtyChange: (isDirty: boolean) => void;
    onSuccess: () => void;
};

export const PostEdit = ({
    post,
    onDirtyChange,
    onSuccess,
}: Props): React.JSX.Element => {
    const { id, author, images, caption } = post;

    return (
        <div className={s.content}>
            <div className={s['image-wrapper']}>
                {images[0]?.url ? (
                    <Image
                        src={images[0].url}
                        alt="Post"
                        fill
                        className={s.image}
                        sizes="(max-width: 768px) 100vw, 490px"
                    />
                ) : (
                    <div className={s['image-placeholder']}>No image</div>
                )}
            </div>

            <div className={s.sidebar}>
                <div className={s.header}>
                    <Avatar src={author.avatarUrl} alt={author.username} size={32} />
                    <span className={s.username}>{author.username}</span>
                </div>

                <EditPostForm
                    onSuccess={onSuccess}
                    postId={id}
                    initialCaption={caption || ''}
                    onDirtyChange={onDirtyChange}
                />
            </div>
        </div>
    );
};
