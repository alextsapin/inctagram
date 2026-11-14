'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { MOCK_FEED_POSTS } from '@/entities/post';
import { useCurrentUser } from '@/entities/session';
import { DeletePostModal } from '@/features/delete-post';
import { PostFeed } from '@/widgets/post-feed';
import { ProfileLayout } from '@/widgets/profile-layout';

import s from './feed-page.module.scss';

export const FeedPage = (): React.JSX.Element => {
    const posts = MOCK_FEED_POSTS;
    const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
    const router = useRouter();
    const { data: currentUser } = useCurrentUser();
    const handleDeleteConfirm = (): void => {
        if (!postIdToDelete) return;

        // TODO: Вызов мутации удаления

        setPostIdToDelete(null); // Закрываем модалку
    };

    return (
        <ProfileLayout withSidebar={!!currentUser}>
            <section className={s['feed-container']}>
                {posts.map(p => (
                    <PostFeed
                        post={p}
                        key={p.id}
                        onDeleteClick={() => setPostIdToDelete(p.id)}
                        onEditClick={() => router.push(`/post/${p.id}/edit`)}
                        onLikesClick={() => router.push(`/post/${p.id}/likes`)}
                    />
                ))}

                <DeletePostModal
                    isOpen={!!postIdToDelete}
                    onClose={() => setPostIdToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                />
            </section>
        </ProfileLayout>
    );
};
