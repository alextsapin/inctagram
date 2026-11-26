'use client';

import { useMemo } from 'react';

import { Alert } from '@/shared/ui/alert';
import { Confirmation } from '@/shared/ui/confirmation';
import { useSuccessAlert } from '@/shared/ui/success-alert';

import { getDeletePostError } from '../model/deletePostError';
import { useDeletePost } from '../model/useDeletePost';

const DELETE_MODAL_WIDTH = 378;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDeleted: () => void;
    postId: string;
};

export const DeletePostModal = ({
    postId,
    isOpen,
    onClose,
    onDeleted,
}: Props): React.JSX.Element => {
    const { mutateAsync, isPending, error, reset } = useDeletePost();
    const showSuccess = useSuccessAlert();

    const errorInfo = useMemo(() => (error ? getDeletePostError(error) : null), [error]);

    const errorText = errorInfo && !errorInfo.isAlreadyDeleted ? errorInfo.text : null;

    const handleClose = (): void => {
        if (isPending) return; // нельзя закрыть во время запроса
        reset();
        onClose();
    };

    const handleConfirm = async (): Promise<void> => {
        try {
            await mutateAsync(postId);
            reset();
            showSuccess('Post deleted successfully');
            onDeleted();
        } catch (err) {
            // 404 — пост уже удалён, ведём себя как при успехе
            if (getDeletePostError(err).isAlreadyDeleted) {
                reset();
                showSuccess('Post deleted successfully');
                onDeleted();
            }
        }
    };

    return (
        <Confirmation
            disabled={isPending}
            width={DELETE_MODAL_WIDTH}
            open={isOpen}
            title="Delete post?"
            text="Are you sure you want to delete this post?"
            confirmText="Yes"
            cancelText="No"
            onConfirm={handleConfirm}
            onCancel={handleClose}
            onClose={handleClose}
        >
            {errorText && <Alert open onClose={reset} type="error" message={errorText} />}
        </Confirmation>
    );
};
