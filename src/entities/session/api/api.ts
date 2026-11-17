import { AxiosError, type AxiosResponse } from 'axios';

import { instance } from '@/shared/api';

import type { Me } from '../model/types';

import { MOCK_ME, USE_MOCKS } from './mock';

const UNAUTHORIZED = 401;

// Гость в мок-режиме: отдаём ошибку той же формы, что и реальный API (401),
// чтобы UI одинаково различал «сессии нет» и «сервер недоступен» в обоих режимах.
const createUnauthorizedError = (): AxiosError => {
    const error = new AxiosError('Not authenticated');

    error.response = { status: UNAUTHORIZED } as AxiosResponse;

    return error;
};

export const getMe = async (): Promise<Me> => {
    if (USE_MOCKS) {
        if (MOCK_ME === null) {
            throw createUnauthorizedError();
        }

        return MOCK_ME;
    }

    const response = await instance.get<Me>('/api/v1/auth/me');

    return response.data;
};
