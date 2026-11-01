'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/shared/ui/modal';
import { PostViewer } from '@/widgets/post-viewer';

import s from './post-page.module.scss';

type Props = {
    postId: string;
    isModal?: boolean;
};

export const PostPage = ({ postId, isModal }: Props): React.JSX.Element => {
    const router = useRouter();

    const handleClose = (): void => {
        // В модалке закрываем назад, на странице — редирект в ленту
        if (isModal) {
            return router.back();
        }
        router.push('/feed');
    };

    const handleEdit = (): void => {
        router.push(`/post/${postId}/edit`);
    };

    const handleDeleted = (): void => {
        if (isModal) {
            router.back();
        } else {
            // replace, чтобы не остаться в истории на удалённом посте
            router.replace('/feed');
        }
    };

    const handleLikesClick = (): void => {
        router.push(`/post/${postId}/likes`);
    };
    const viewer = (
        <PostViewer
            postId={postId}
            onEdit={handleEdit}
            onDeleted={handleDeleted}
            onLikesClick={handleLikesClick}
        />
    );

    return isModal ? (
        <Modal open onClose={handleClose} width={975} closeOutside>
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
