'use client';

import { useState } from 'react';

import styles from './alert.module.scss';

type AlertType = 'success' | 'error' | 'waiting' | 'info';

type AlertProps = {
    type?: AlertType;
    message?: string;
};

export const Alert = ({
    type = 'waiting',
    message = 'Inform Message',
}: AlertProps): React.JSX.Element => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div>
            {isVisible && (
                <div className={`${styles.alert} ${styles[type]}`} role="alert">
                    <span>{message}</span>
                    <button
                        className={styles['close-button']}
                        type="button"
                        onClick={() => setIsVisible(false)}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};
