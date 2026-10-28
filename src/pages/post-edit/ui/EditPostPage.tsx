'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { PostEdit } from '@/widgets/post-editor';

import s from './edit-post-page.module.scss';

type Props = {
    postId: string;
    isModal?: boolean;
};

const EDIT_POST_MODAL_WIDTH = 972;
const CLOSE_MODAL_WIDTH = 432;

export const EditPostPage = ({ postId, isModal }: Props): React.JSX.Element => {
    const router = useRouter();
    const [isDirty, setIsDirty] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

    const navigateBack = (): void => {
        router.back();
    };

    const handleBackClick = (e: React.MouseEvent): void => {
        if (isDirty) {
            e.preventDefault();
            setIsCloseModalOpen(true);
        }
    };

    const handleCloseAttempt = (): void => {
        if (isDirty) {
            setIsCloseModalOpen(true);
        } else {
            navigateBack();
        }
    };

    // 2. Подтверждение закрытия в модалке
    const handleCloseConfirm = (): void => {
        setIsCloseModalOpen(false);
        navigateBack();
    };

    // 3. Сохранение формы
    const handleSuccess = (): void => {
        router.push(`/post/${postId}`);
    };

    return (
        <>
            {isModal ? (
                <Modal
                    noPadding
                    title="Edit Post"
                    open
                    onClose={handleCloseAttempt}
                    width={EDIT_POST_MODAL_WIDTH}
                    closeOutside={false}
                >
                    <PostEdit
                        postId={postId}
                        onDirtyChange={setIsDirty}
                        onSuccess={handleSuccess}
                    />
                </Modal>
            ) : (
                <main className={s.page}>
                    <div className={s.container}>
                        <div className={s.header}>
                            <h1 className={s.title}>Edit Post</h1>

                            <Link
                                href="/"
                                onClick={handleBackClick}
                                className={s['back-btn']}
                            >
                                Back
                            </Link>
                        </div>
                        <PostEdit
                            postId={postId}
                            onDirtyChange={setIsDirty}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </main>
            )}

            <Modal
                open={isCloseModalOpen}
                onClose={() => setIsCloseModalOpen(false)}
                title="Unsaved Changes"
                width={CLOSE_MODAL_WIDTH}
                actions={
                    <>
                        <Button variant="outlined" onClick={handleCloseConfirm}>
                            Yes
                        </Button>
                        <Button onClick={() => setIsCloseModalOpen(false)}>Cancel</Button>
                    </>
                }
            >
                <p>
                    Do you really want to close editing? If you close, changes won&apos;t
                    be saved.
                </p>
            </Modal>
        </>
    );
};
