'use client';

import Image from 'next/image';

import closeIcon from '../lib/close.png';

import styles from './alert.module.scss';

type AlertType = 'success' | 'error';

type AlertProps = {
    open: boolean;
    onClose?: () => void;
    type?: AlertType;
    message: string;
};

export const Alert = ({
    open,
    onClose,
    type = 'error',
    message,
}: AlertProps): React.JSX.Element => {
    return (
        <div>
            {open && (
                <div className={`${styles.alert} ${styles[type]}`} role="alert">
                    {type === 'error' && (
                        <strong className={styles['error-label']}>Error!</strong>
                    )}
                    <span className={styles.message}>{message}</span>
                    {onClose && (
                        <button
                            className={styles['close-button']}
                            type="button"
                            onClick={onClose}
                        >
                            <Image src={closeIcon} alt="Close" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
