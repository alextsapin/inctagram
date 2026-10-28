'use client';

import Link from 'next/link';
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

    return isModal ? (
        <Modal
            title="Likes"
            open
            onClose={() => router.back()}
            width={LIKES_MODAL_WIDTH}
            closeOutside
        >
            <PostLikesList postId={postId} />
        </Modal>
    ) : (
        <main
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '0 5px',
            }}
        >
            <div className={s.container}>
                <div className={s.header}>
                    <h1 className={s.title}>Likes</h1>
                    <Link
                        href="/"
                        onClick={() => router.back()}
                        className={s['back-btn']}
                    >
                        Back
                    </Link>
                </div>
                <PostLikesList postId={postId} />
            </div>
        </main>
    );
};
