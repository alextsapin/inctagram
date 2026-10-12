'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { createQueryClient } from '@/shared/api';

type Props = {
    children: ReactNode;
};

export const QueryProvider = ({ children }: Props): React.JSX.Element => {
    const [queryClient] = useState(createQueryClient);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
