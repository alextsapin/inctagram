'use client';

import { useRouter } from 'next/navigation';

import { usePost } from '@/entities/post';
import { useCurrentUser } from '@/entities/session';
import { Alert } from '@/shared/ui/alert';
import { Modal } from '@/shared/ui/modal';
import { PostViewer, PostViewerSkeleton } from '@/widgets/post-viewer';

import s from './post.module.scss';

type Props = {
    postId: string;
    isModal?: boolean;
};
const POST_MODAL_WIDTH = 975;

export const Post = ({ postId, isModal }: Props): React.JSX.Element => {
    const router = useRouter();
    const { data: post, isLoading, isError, error } = usePost(postId);
    const {
        data: currentUser,
        isError: isErrorUser,
        isLoading: isLoadingUser,
    } = useCurrentUser();
    const isAuthed = Boolean(currentUser) && !isErrorUser;
    const isOwnPost = Boolean(
        currentUser && post && currentUser.userId === post.author.id,
    );

    const handleClose = (): void => {
        // В модалке закрываем назад, на странице — редирект в ленту
        if (isModal) return router.back();
        router.replace(isAuthed ? '/feed' : '/');
    };

    if (isLoading || isLoadingUser) {
        return isModal ? (
            <Modal open onClose={handleClose} width={POST_MODAL_WIDTH} closeOutside>
                <PostViewerSkeleton />
            </Modal>
        ) : (
            <main className={s.page}>
                <PostViewerSkeleton />
            </main>
        );
    }

    if (isError || !post) {
        return (
            <Alert
                open
                onClose={handleClose}
                type="error"
                message={error?.message || 'Не удалось загрузить пост'}
            />
        );
    }

    const handleEdit = (): void => {
        router.push(`/post/${postId}/edit`);
    };

    const handleDeleted = (): void => {
        if (isModal) {
            router.back();
        } else {
            const profilePath = currentUser?.username
                ? `/profile/${currentUser.username}`
                : '/';

            router.replace(profilePath);
        }
    };

    const handleLikesClick = (): void => {
        router.push(`/post/${postId}/likes`);
    };

    const viewer = (
        <PostViewer
            post={post}
            onEdit={handleEdit}
            onDeleted={handleDeleted}
            onLikesClick={handleLikesClick}
            isAuthed={isAuthed}
            isOwnPost={isOwnPost}
        />
    );

    return isModal ? (
        <Modal open onClose={handleClose} width={POST_MODAL_WIDTH} closeOutside>
            {viewer}
        </Modal>
    ) : (
        <main className={s.page}>
            <div className={s.container}>
                <div className={s.header}>
                    <h1 className={s.title}>Post</h1>
                    <button type="button" onClick={handleClose} className={s['back-btn']}>
                        Back
                    </button>
                </div>
                {viewer}
            </div>
        </main>
    );
};
