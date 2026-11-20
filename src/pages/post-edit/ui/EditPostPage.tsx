'use client';

import { useEffect, useState } from 'react';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { usePost } from '@/entities/post';
import { useCurrentUser } from '@/entities/session';
import { Alert } from '@/shared/ui/alert';
import { Confirmation } from '@/shared/ui/confirmation';
import { Modal } from '@/shared/ui/modal';
import { PostEdit, PostEditSkeleton } from '@/widgets/post-editor';

import s from './edit-post-page.module.scss';

type Props = {
    postId: string;
    isModal?: boolean;
};

const EDIT_POST_MODAL_WIDTH = 972;
const CLOSE_MODAL_WIDTH = 432;
const UNAUTHORIZED = 401;

export const EditPostPage = ({ postId, isModal }: Props): React.JSX.Element | null => {
    const router = useRouter();

    const [isDirty, setIsDirty] = useState(false);

    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const {
        data: post,
        isLoading,
        isError: isErrorPost,
        error: errorPost,
    } = usePost(postId);

    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isErrorUser,
        error: errorUser,
    } = useCurrentUser();

    // 401 — сессии нет, это гость.
    // Любая другая ошибка (404, 500, сеть) не означает «гость
    const isUnauthorized =
        isAxiosError(errorUser) && errorUser.response?.status === UNAUTHORIZED;
    const isRealUserError = isErrorUser && !isUnauthorized;

    // Гость: юзера нет и это не ошибка, ЛИБО упал 401.
    const isGuest = !isUserLoading && !currentUser && !isRealUserError;

    const isAuthor = !!currentUser && !!post && currentUser.userId === post.author.id;
    const canEdit = !isGuest && isAuthor;

    useEffect(() => {
        // Если загрузка завершена и это не реальная ошибка сервера,
        // но пользователь не может редактировать (гость или не автор) — редиректим
        if (!isLoading && !isUserLoading && !isRealUserError && post && !canEdit) {
            if (isModal) router.back();
            else router.replace(`/post/${postId}`);
        }
    }, [
        post,
        currentUser,
        isLoading,
        isUserLoading,
        router,
        postId,
        canEdit,
        isModal,
        isRealUserError,
    ]);

    if (isLoading || isUserLoading) {
        return isModal ? (
            <Modal open onClose={() => router.back()} width={EDIT_POST_MODAL_WIDTH}>
                <PostEditSkeleton />
            </Modal>
        ) : (
            <main className={s.page}>
                <PostEditSkeleton />
            </main>
        );
    }
    // Если это гость (401 или просто нет юзера) — уходим сразу. редирект сделает useEffect
    // Нам неважно, упал пост или нет, гость не должен видеть ошибки редактирования.
    if (isGuest) {
        return null;
    }

    if (isRealUserError || isErrorPost || !post) {
        const errorText = isRealUserError
            ? 'Failed to load user data'
            : errorPost?.message || 'Failed to load post';

        return (
            <Alert open onClose={() => router.back()} type="error" message={errorText} />
        );
    }

    // Блокируем рендер формы для не-автора (пока срабатывает useEffect)
    if (!canEdit) {
        return null;
    }
    // Единая функция закрытия (выполняется, если нет несохраненных изменений или юзер подтвердил)
    // --- ФУНКЦИИ НАВИГАЦИИ ---
    const executeClose = (): void => {
        if (isModal) {
            // Если это модалка — возвращаемся туда, откуда пришли (к просмотру поста)
            router.back();
        } else {
            router.replace(`/post/${postId}`);
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
                        post={post}
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
                            post={post}
                            onDirtyChange={setIsDirty}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </main>
            )}

            <Confirmation
                title="Close Post"
                open={isCloseModalOpen}
                onClose={() => setIsCloseModalOpen(false)}
                width={CLOSE_MODAL_WIDTH}
                confirmText="Yes"
                cancelText="No"
                onConfirm={handleCloseConfirm}
                onCancel={() => setIsCloseModalOpen(false)}
                text="Do you really want to finish editing? If you close the changes you have made will not be saved"
            />
        </>
    );
};
