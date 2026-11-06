'use client';

import { useState } from 'react';

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
    // const safeClose = useSafeClose('/feed');
    const [isDirty, setIsDirty] = useState(false);

    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

    // --- ФУНКЦИИ НАВИГАЦИИ ---

    // Единая функция закрытия (выполняется, если нет несохраненных изменений или юзер подтвердил)
    const executeClose = (): void => {
        if (isModal) {
            // Если это модалка — возвращаемся туда, откуда пришли (к просмотру поста)
            router.back();
        } else {
            // Если это страница — ведем в ленту
            router.push('/feed');
        }
    };

    // Клик по кнопке "Назад" (только для страницы)
    const handleBackClick = (): void => {
        if (isDirty) {
            setIsCloseModalOpen(true); // Показываем модалку "Вы уверены?"
        } else {
            executeClose();
        }
    };

    // Попытка закрыть модалку редактирования (крестик, клик мимо)
    const handleCloseAttempt = (): void => {
        if (isDirty) {
            setIsCloseModalOpen(true);
        } else {
            executeClose();
        }
    };

    // Подтверждение закрытия в модалке "Unsaved Changes"
    const handleCloseConfirm = (): void => {
        setIsCloseModalOpen(false);
        executeClose(); // Изменения отбрасываются, принудительно закрываем
    };

    // Успешное сохранение формы
    const handleSuccess = (): void => {
        if (isModal) {
            // Если были в модалке — закрываем её (возвращаемся к просмотру поста)
            router.back();
        } else {
            // Если на странице — переходим на страницу поста
            router.replace(`/post/${postId}`);
        }
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

                            <button
                                type="button"
                                onClick={handleBackClick}
                                className={s['back-btn']}
                            >
                                Back
                            </button>
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
