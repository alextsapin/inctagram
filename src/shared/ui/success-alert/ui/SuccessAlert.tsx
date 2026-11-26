'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from '@/shared/ui/alert';

import { hideSuccess, selectSuccessMessage } from '../model/successAlertSlice';

// Через сколько миллисекунд сообщение закрывается само
const AUTO_CLOSE_MS = 3000;

// Показывает зелёное сообщение из стора. Стоит один раз в корневом layout,
// поэтому сообщение не пропадает, когда после успеха открывается другая
// страница (например, профиль после публикации поста)
export const SuccessAlert = (): React.JSX.Element | null => {
    const message = useSelector(selectSuccessMessage);
    const dispatch = useDispatch();
    // Элемент, внутри которого рисуем сообщение: открытое окно или body
    const [container, setContainer] = useState<Element | null>(null);
    const pathname = usePathname();

    // Сообщение закрывается само через 3 секунды
    useEffect(() => {
        if (message === null) return;

        const timer = setTimeout(() => dispatch(hideSuccess()), AUTO_CLOSE_MS);

        return (): void => clearTimeout(timer);
    }, [message, dispatch]);

    // Открытое окно (<dialog>) лежит поверх всей страницы: сообщение под ним не видно
    // и его крестик не нажать. Поэтому, если окно открыто, рисуем сообщение внутри
    // последнего открытого окна, а если нет, то в body.
    // Ищем заново при новом сообщении и после перехода: например, после Save Changes
    // снова открывается окно поста
    useEffect(() => {
        const openDialogs = document.querySelectorAll('dialog[open]');

        setContainer(openDialogs[openDialogs.length - 1] ?? document.body);
    }, [message, pathname]);

    // container равен null только до первого эффекта: на сервере document нет
    if (!container) return null;

    return createPortal(
        <Alert
            open={message !== null}
            onClose={() => dispatch(hideSuccess())}
            type="success"
            message={message ?? ''}
        />,
        container,
    );
};
