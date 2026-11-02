'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/shared/ui/modal';
import { PostLikesList } from '@/widgets/post-likers';

import s from './post-likes-page.module.scss';

type Props = {
    postId: string;
    isModal?: boolean;
};
const LIKES_MODAL_WIDTH = 644;

export const PostLikesPage = ({ postId, isModal }: Props): React.JSX.Element => {
    const router = useRouter();

    const handleClose = (): void => {
        if (isModal) {
            // В модалке возвращаемся туда, откуда открыли (к посту или в ленту)
            router.back();
        } else {
            // ????
            router.push(`/feed`);
        }
    };

    return isModal ? (
        <Modal
            title="Likes"
            open
            onClose={handleClose}
            width={LIKES_MODAL_WIDTH}
            closeOutside
        >
            <PostLikesList postId={postId} />
        </Modal>
    ) : (
        <main className={s.page}>
            <div className={s.container}>
                <div className={s.header}>
                    <h1 className={s.title}>Likes</h1>
                    <button type="button" onClick={handleClose} className={s['back-btn']}>
                        Back
                    </button>
                </div>
                <PostLikesList postId={postId} />
            </div>
        </main>
    );
};
