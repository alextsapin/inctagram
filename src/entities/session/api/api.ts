import type { Me } from '../model/types';

export const getMe = async (): Promise<Me> => {
    const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to load current user: ${response.status}`);
    }

    return (await response.json()) as Me;
};
