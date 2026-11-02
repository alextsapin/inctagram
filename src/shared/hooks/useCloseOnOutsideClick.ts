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
                // Escape закрывает только выпадающую часть, а модалку, в которой она стоит, — нет.
                // stopPropagation: событие не дойдёт до обработчика модалки.
                // preventDefault: браузер сам не закроет <dialog> по Escape
                event.stopPropagation();
                event.preventDefault();
                onClose();
            }
        };

        // Пока открыто, слушаем клики и клавиши на всей странице.
        // У клавиш третий аргумент true — слушаем на перехвате (capture):
        // событие сначала идёт сверху вниз от document к элементу, и на этом пути
        // хук узнаёт про Escape раньше модалки и успевает его остановить
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKeyDown, true);

        // Закрылось — перестаём слушать. Снимать нужно с тем же true
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [ref, isOpen, onClose]);
};
