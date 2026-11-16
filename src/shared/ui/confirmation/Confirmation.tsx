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
    // Обе кнопки неактивны, например пока действие выполняется: второй клик ничего не сделает
    disabled?: boolean;
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
    disabled = false,
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
                    <Button variant="outlined" disabled={disabled} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                    <Button disabled={disabled} onClick={onCancel}>
                        {cancelText}
                    </Button>
                </>
            }
        >
            <p>{text}</p>
        </Modal>
    );
};
