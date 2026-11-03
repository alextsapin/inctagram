'use client';

import closeIcon from '../assets/close.png';
// import { useState } from 'react';

import styles from './alert.module.css';

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
}: AlertProps): React.JSX.Element => {


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
            <img aria-label="Close"
              src={closeIcon} alt="Close" />
          </button>
        </div>
      )}
    </div>
  );
};
