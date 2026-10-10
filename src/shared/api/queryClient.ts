import { QueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 60_000;

export const createQueryClient = (): QueryClient => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: DEFAULT_STALE_TIME,
            },
        },
    });
};
