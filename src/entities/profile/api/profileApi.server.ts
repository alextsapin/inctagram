import 'server-only';

import { cache } from 'react';

import { getFromServer, isNotFoundError } from '@/shared/api/server';

import type { Profile } from '../model/types';

// Профиль по username для серверной загрузки страницы. null — такого профиля нет.
// Если бэкенд не ответил, выбрасывает ошибку: тогда профиль загрузит браузер.
// cache() — за одно открытие страницы запрос уходит один раз, даже если функцию
// вызвали и в generateMetadata, и в самой странице
export const getProfileOnServer = cache(
    async (username: string): Promise<Profile | null> => {
        try {
            return await getFromServer<Profile>(
                `/api/v1/${encodeURIComponent(username)}/profile`,
            );
        } catch (error) {
            if (isNotFoundError(error)) return null;

            throw error;
        }
    },
);
