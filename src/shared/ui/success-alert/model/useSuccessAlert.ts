'use client';

import { useDispatch } from 'react-redux';

import { showSuccess } from './successAlertSlice';

// Возвращает функцию для показа зелёного сообщения:
// const showSuccess = useSuccessAlert();
// showSuccess('Your post has been published');
export const useSuccessAlert = (): ((message: string) => void) => {
    const dispatch = useDispatch();

    return (message: string): void => {
        dispatch(showSuccess(message));
    };
};
