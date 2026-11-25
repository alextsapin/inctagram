import { Alert } from '@/shared/ui/alert';
import { Confirmation } from '@/shared/ui/confirmation';

const DELETE_PHOTO_MODAL_WIDTH = 438;

type DeletePhotoModalProps = {
    open: boolean;
    // Пока идёт запрос, обе кнопки неактивны
    isPending: boolean;
    // Текст ошибки удаления; null — ошибки нет
    errorText: string | null;
    onConfirm: () => void;
    onClose: () => void;
    onDismissError: () => void;
};

// Подтверждение удаления фото. Ошибку показываем внутри окна, как в
// DeletePostModal: Alert кладётся в children Confirmation
export const DeletePhotoModal = ({
    open,
    isPending,
    errorText,
    onConfirm,
    onClose,
    onDismissError,
}: DeletePhotoModalProps): React.JSX.Element => {
    return (
        <Confirmation
            open={open}
            title="Delete Photo"
            text="Are you sure you want to delete the photo?"
            confirmText="Yes"
            cancelText="No"
            width={DELETE_PHOTO_MODAL_WIDTH}
            disabled={isPending}
            onConfirm={onConfirm}
            onCancel={onClose}
            onClose={onClose}
        >
            {errorText && (
                <Alert open onClose={onDismissError} type="error" message={errorText} />
            )}
        </Confirmation>
    );
};
