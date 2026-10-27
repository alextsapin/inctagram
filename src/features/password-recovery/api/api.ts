import { instance } from '@/shared/api';

import type { ForgotPasswordValues, NewPasswordRequest } from '../model/types';

// Отправить ссылку для восстановления пароля на email.
// Бэкенд отвечает 204 и для незарегистрированного email: так нельзя узнать, кто есть в системе
export const recoverPassword = async (values: ForgotPasswordValues): Promise<void> => {
    await instance.post('/api/v1/auth/password-recovery', values);
};

// Задать новый пароль. code — из ссылки в письме (?code=...)
export const createNewPassword = async (values: NewPasswordRequest): Promise<void> => {
    await instance.post('/api/v1/auth/new-password', values);
};
