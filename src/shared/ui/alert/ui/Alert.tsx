'use client';

import { CloseIcon } from '../../icons/CloseIcon';

import styles from './alert.module.scss';

type AlertType = 'success' | 'error';

type AlertProps = {
    open: boolean;
    onClose: () => void;
    type?: AlertType;
    message: string;
};

export const Alert = ({
    open,
    onClose,
    type = 'error',
    message,
}: AlertProps): React.JSX.Element | null => {
    if (!open) return null;

    return (
        <div>
            {open && (
                <div className={`${styles.alert} ${styles[type]}`} role="alert">
                    {type === 'error' && (
                        <strong className={styles['error-label']}>Error!</strong>
                    )}
                    <span className={styles.message}>{message}</span>

                    <button
                        className={styles['close-button']}
                        type="button"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                </div>
            )}
        </div>
    );
};
