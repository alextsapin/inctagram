import type { Me } from '../model/types';

import { MOCK_ME, USE_MOCKS } from './mock';

export const getMe = async (): Promise<Me> => {
    if (USE_MOCKS) {
        return MOCK_ME;
    }

    const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to load current user: ${response.status}`);
    }

    return (await response.json()) as Me;
};
