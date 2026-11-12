'use client';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

type ConfirmationProps = {
    open: boolean;
    title: string;
    text: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onCancel?: () => void;
    width?: number;
    actionsAlign?: 'end' | 'between';
    onConfirm: () => void;
    onClose: () => void;
};

export const Confirmation = ({
    open,
    title,
    width,
    text,
    confirmText,
    cancelText,
    onCancel,
    actionsAlign = 'end',
    onConfirm,
    onClose,
}: ConfirmationProps): React.JSX.Element => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            width={width}
            actionsAlign={actionsAlign}
            actions={
                <>
                    <Button variant="outlined" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                    <Button onClick={onCancel}>{cancelText}</Button>
                </>
            }
        >
            <p>{text}</p>
        </Modal>
    );
};
