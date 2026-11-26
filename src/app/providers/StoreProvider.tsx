'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { Provider } from 'react-redux';

import { makeStore } from '../store';

type Props = {
    children: ReactNode;
};

// Стор создаётся один раз на каждое появление провайдера, как QueryClient
// в QueryProvider: на сервере это каждое открытие страницы, в браузере
// один раз на вкладку. Поэтому у каждого посетителя свой стор
export const StoreProvider = ({ children }: Props): React.JSX.Element => {
    const [store] = useState(makeStore);

    return <Provider store={store}>{children}</Provider>;
};
