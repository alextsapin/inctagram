'use client';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

const DELETE_MODAL_WIDTH = 378;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending?: boolean;
};

export const DeletePostModal = ({
    isOpen,
    onClose,
    onConfirm,
    isPending,
}: Props): React.JSX.Element => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Delete Post"
            width={DELETE_MODAL_WIDTH}
            closeOutside={false}
            actions={
                <>
                    <Button variant="outlined" onClick={onConfirm} disabled={isPending}>
                        Yes
                    </Button>
                    <Button onClick={onClose} disabled={isPending}>
                        No
                    </Button>
                </>
            }
        >
            <p>Are you sure you want to delete this post?</p>
        </Modal>
    );
};
