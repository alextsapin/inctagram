import { useEffect, type RefObject } from 'react';

// Закрывает выпадающий элемент (календарь, список), если кликнули мимо него или нажали Escape
export const useCloseOnOutsideClick = (
    ref: RefObject<HTMLDivElement | null>, // обёртка компонента (поле + выпадающая часть)
    isOpen: boolean,
    onClose: () => void,
): void => {
    useEffect(() => {
        // Закрыто — следить не за чем
        if (!isOpen) return;

        const handleClick = (event: MouseEvent): void => {
            const clickedInside = ref.current?.contains(event.target as Node);

            if (!clickedInside) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Пока открыто, слушаем клики и клавиши на всей странице
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKeyDown);

        // Закрылось — перестаём слушать
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref, isOpen, onClose]);
};
