'use client';

import { useCallback, useEffect, useState } from 'react';

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
        isLoading: isLoadingPost,
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
    const isGuest =
        !isUserLoading && (isUnauthorized || (!currentUser && !isRealUserError));

    const isAuthor = !!currentUser && !!post && currentUser.userId === post.author.id;
    const canEdit = !isGuest && isAuthor;
    // Единая навигация на страницу просмотра поста.
    const navigateToPost = useCallback((): void => {
        if (isModal) {
            router.back();
        } else {
            window.location.replace(`/post/${postId}`);
        }
    }, [isModal, postId, router]);

    // Обработка доступа к странице редактирования.
    useEffect(() => {
        // Ждём определения пользователя.
        if (isUserLoading) return;

        // 1. Гость: редирект независимо от результата загрузки поста.
        if (isGuest) {
            navigateToPost();

            return;
        }

        // 2. Для авторизованного пользователя ждём загрузку поста.
        if (isLoadingPost) return;

        // 3. Если пост загружен, но пользователь не автор — редирект.
        if (!isRealUserError && post && !canEdit) {
            navigateToPost();
        }
    }, [
        post,
        currentUser,
        isLoadingPost,
        isUserLoading,
        canEdit,
        isRealUserError,
        isGuest,
        navigateToPost,
    ]);

    const renderSkeleton = (): React.JSX.Element =>
        isModal ? (
            <Modal open onClose={navigateToPost} width={EDIT_POST_MODAL_WIDTH}>
                <PostEditSkeleton />
            </Modal>
        ) : (
            <main className={s.page}>
                <PostEditSkeleton />
            </main>
        );

    // Если это гость (401 или просто нет юзера) — уходим сразу. редирект сделает useEffect
    // Нам неважно, упал пост или нет, гость не должен видеть ошибки редактирования.

    // Пока загружается пользователь, показываем Skeleton.
    if (isUserLoading) {
        return renderSkeleton();
    }

    if (isGuest) {
        return null;
    }

    if (isLoadingPost) {
        return renderSkeleton();
    }
    if (isRealUserError || isErrorPost || !post) {
        const errorText = isRealUserError
            ? 'Failed to load user data'
            : errorPost?.message || 'Failed to load post';

        return <Alert open onClose={navigateToPost} type="error" message={errorText} />;
    }

    //  // Блокируем отображение формы для пользователей, которые не могут редактировать пост. (пока срабатывает useEffect)
    if (!canEdit) {
        return null;
    }
    // Единая функция закрытия (выполняется, если нет несохраненных изменений или юзер подтвердил)
    // --- ФУНКЦИИ НАВИГАЦИИ ---
    const handleCloseAttempt = (): void => {
        if (isDirty) {
            setIsCloseModalOpen(true);
        } else {
            navigateToPost();
        }
    };

    // Попытка закрыть модалку редактирования (крестик, клик мимо)
    const handleCloseConfirm = (): void => {
        setIsCloseModalOpen(false);
        navigateToPost();
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
                        onSuccess={navigateToPost}
                    />
                </Modal>
            ) : (
                <main className={s.page}>
                    <div className={s.container}>
                        <div className={s.header}>
                            <h1 className={s.title}>Edit Post</h1>

                            <button
                                type="button"
                                onClick={handleCloseAttempt}
                                className={s['back-btn']}
                            >
                                Back
                            </button>
                        </div>
                        <PostEdit
                            post={post}
                            onDirtyChange={setIsDirty}
                            onSuccess={navigateToPost}
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
