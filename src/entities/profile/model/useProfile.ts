'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { profileApi, ProfileNotFoundError } from '../api/profileApi';
import { profileQueryKeys } from '../api/queryKeys';

import type { Profile } from './types';

// Максимум повторных попыток для обычных (сетевых/серверных) ошибок.
// ProfileNotFoundError при этом не ретраится вовсе (см. retry ниже).
const MAX_RETRY_COUNT = 3;

export type UseProfileResult = UseQueryResult<Profile, Error> & {
    // true, если профиль с таким username не существует (ProfileNotFoundError).
    // Это отдельное состояние от обычной ошибки: не показываем шапку с ошибкой
    // и сетку постов, а рендерим целиком «такого профиля нет».
    isNotFound: boolean;
};

// Данные шапки профиля через useQuery. queryKey — существующий
// profileQueryKeys.detail(username), чтобы инвалидация profileQueryKeys.all
// обновляла и шапку. Хук может использоваться не только в шапке профиля.
export const useProfile = (username: string): UseProfileResult => {
    const query = useQuery({
        queryKey: profileQueryKeys.detail(username),
        queryFn: () => profileApi.getUserProfile(username),
        enabled: Boolean(username),
        // «Профиля нет» (ProfileNotFoundError) — окончательный результат, а не
        // временная сетевая проблема: не повторяем запрос. Обычные ошибки (сети,
        // сервера) продолжают ретраиться, как и раньше, на случай реального бэкенда.
        retry: (failureCount, error) =>
            !(error instanceof ProfileNotFoundError) && failureCount < MAX_RETRY_COUNT,
    });

    const isNotFound = query.error instanceof ProfileNotFoundError;

    return { ...query, isNotFound };
};
