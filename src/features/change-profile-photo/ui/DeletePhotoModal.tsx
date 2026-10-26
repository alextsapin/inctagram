import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

const DELETE_PHOTO_MODAL_WIDTH = 438;

type DeletePhotoModalProps = {
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

// Подтверждение удаления фото, по примеру из README Modal (раздел 2)
export const DeletePhotoModal = ({
    open,
    onConfirm,
    onClose,
}: DeletePhotoModalProps): React.JSX.Element => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Delete Photo"
            width={DELETE_PHOTO_MODAL_WIDTH}
            actions={
                <>
                    <Button variant="outlined" onClick={onConfirm}>
                        Yes
                    </Button>
                    <Button onClick={onClose}>No</Button>
                </>
            }
        >
            <p>Are you sure you want to delete the photo?</p>
        </Modal>
    );
};
