'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { MOCK_POSTS } from '@/entities/post/model/mock';
import { EditPostForm } from '@/features/edit-post';
import { Avatar } from '@/shared/ui/avatar';

import s from './post-edit.module.scss';

type Props = {
    postId: string;
    onDirtyChange: (isDirty: boolean) => void;
    onSuccess?: () => void;
};

export const PostEdit = ({
    postId,
    onDirtyChange,
    onSuccess,
}: Props): React.JSX.Element => {
    const data = MOCK_POSTS.find(p => p.id === postId);
    const router = useRouter();

    if (!data) return <div>Пост не найден </div>;

    const handleSuccess = (): void => {
        if (onSuccess) {
            onSuccess();
        } else {
            router.push(`/post/${postId}`);
        }
    };

    return (
        <div className={s.content}>
            <div className={s['image-wrapper']}>
                <Image
                    src={data.images[0].url}
                    alt="Post"
                    fill
                    className={s.image}
                    sizes="(max-width: 768px) 100vw, 490px"
                />
            </div>

            <div className={s.sidebar}>
                <div className={s.header}>
                    <Avatar
                        src={data.author.avatarUrl}
                        alt={data.author.username}
                        size={32}
                    />
                    <span className={s.username}>{data.author.username}</span>
                </div>

                <EditPostForm
                    onSuccess={handleSuccess}
                    postId={postId}
                    initialCaption={data.caption || ''}
                    onDirtyChange={onDirtyChange}
                />
            </div>
        </div>
    );
};
