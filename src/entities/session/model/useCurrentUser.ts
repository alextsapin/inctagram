'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getMe } from '../api/api';

import type { Me } from './types';

export const currentUserQueryKey = ['session', 'me'] as const;

export const useCurrentUser = (): UseQueryResult<Me, Error> => {
    return useQuery({
        queryKey: currentUserQueryKey,
        queryFn: getMe,
        retry: false,
    });
};
