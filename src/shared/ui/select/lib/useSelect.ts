import { useEffect, useId, useRef, useState, type RefObject } from 'react';

import { useCloseOnOutsideClick } from '@/shared/lib';

import { findOptionByText } from './findOptionByText';
import { isSameLetterRepeated } from './isSameLetterRepeated';
import { isSearchKey } from './isSearchKey';
import { type SelectOption } from './types';

// Поиск по буквам: после такой паузы (мс) набор начинается заново, как в нативном select
const SEARCH_RESET_DELAY = 500;

type ButtonKeyboardEvent = React.KeyboardEvent<HTMLButtonElement>;

type UseSelectParams = {
    options: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
};

type UseSelectResult = {
    rootRef: RefObject<HTMLDivElement | null>;
    listId: string;
    isOpen: boolean;
    activeIndex: number;
    selectedOption?: SelectOption;
    getOptionId: (index: number) => string;
    toggle: () => void;
    choose: (option: SelectOption) => void;
    highlight: (index: number) => void;
    handleKeyDown: (event: ButtonKeyboardEvent) => void;
};

// id пункта списка. Нужен, чтобы скринридер понимал, какой пункт подсвечен
const makeOptionId = (listId: string, index: number): string =>
    `${listId}-option-${index}`;

// Вся логика выпадающего списка: открыт / закрыт, подсветка пункта,
// клавиатура и поиск по буквам. Разметку рисует компонент Select
export const useSelect = ({
    options,
    value,
    onChange,
}: UseSelectParams): UseSelectResult => {
    const [isOpen, setIsOpen] = useState(false);
    // Номер подсвеченного пункта: его выделяет мышь, стрелки или поиск по буквам
    const [activeIndex, setActiveIndex] = useState(-1);
    const rootRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    // Буквы, которые пользователь успел набрать, и номер таймера, который их сбросит.
    // useRef, а не useState: перерисовывать компонент при каждой букве не нужно
    const typedRef = useRef('');
    const typingTimerRef = useRef(0);

    const selectedIndex = options.findIndex(option => option.value === value);
    const selectedOption = options[selectedIndex];

    const getOptionId = (index: number): string => makeOptionId(listId, index);

    const open = (): void => {
        setIsOpen(true);

        // Подсвечиваем выбранный пункт, а если ничего не выбрано — первый
        if (selectedIndex === -1) {
            setActiveIndex(0);
        } else {
            setActiveIndex(selectedIndex);
        }
    };

    const close = (): void => {
        setIsOpen(false);
    };

    const toggle = (): void => {
        if (isOpen) {
            close();
        } else {
            open();
        }
    };

    const choose = (option: SelectOption): void => {
        onChange(option.value);
        close();
    };

    const highlight = (index: number): void => {
        setActiveIndex(index);
    };

    useCloseOnOutsideClick(rootRef, isOpen, close);

    // Длинный список прокручиваем так, чтобы подсвеченный пункт был виден
    useEffect(() => {
        if (!isOpen) return;

        const activeOption = document.getElementById(makeOptionId(listId, activeIndex));

        activeOption?.scrollIntoView({ block: 'nearest' });
    }, [isOpen, activeIndex, listId]);

    // Поиск по первым буквам, как в нативном select:
    // «k» — первый пункт на K, «ky» — первый на «ky», «k», «k», «k» — перебор пунктов на K
    const searchByTyping = (char: string): void => {
        // Добавляем символ к набранным и заново запускаем таймер сброса
        window.clearTimeout(typingTimerRef.current);
        typedRef.current += char.toLowerCase();
        typingTimerRef.current = window.setTimeout(() => {
            typedRef.current = '';
        }, SEARCH_RESET_DELAY);

        const typed = typedRef.current;

        // «kkk» ищем как «k»: так повторное нажатие перебирает пункты на эту букву
        let searchText = typed;

        if (isSameLetterRepeated(typed)) {
            searchText = typed.charAt(0); // первая буква
        }

        // Ищем со следующего пункта после текущего
        let currentIndex = selectedIndex;

        if (isOpen) {
            currentIndex = activeIndex;
        }

        const foundOption = findOptionByText(options, searchText, currentIndex + 1);

        if (!foundOption) return;

        if (isOpen) {
            // Список открыт — только подсвечиваем, выбор по Enter
            setActiveIndex(options.indexOf(foundOption));
        } else {
            // Список закрыт — сразу меняем значение, как нативный select
            onChange(foundOption.value);
        }
    };

    // Буква или цифра: поиск по первым буквам
    const handleSearchKey = (event: ButtonKeyboardEvent): void => {
        event.preventDefault(); // пробел не должен нажимать кнопку
        searchByTyping(event.key);
    };

    // Стрелки вверх и вниз
    const handleArrowKey = (event: ButtonKeyboardEvent): void => {
        event.preventDefault(); // чтобы не прокручивалась страница

        // Закрытый список стрелка только открывает
        if (!isOpen) {
            open();

            return;
        }

        const step = event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = activeIndex + step;
        const lastIndex = options.length - 1;

        // Выше первого и ниже последнего пункта не уходим
        if (nextIndex < 0 || nextIndex > lastIndex) return;

        setActiveIndex(nextIndex);
    };

    // Enter, пробел, Escape и Tab в открытом списке
    const handleOpenListKey = (event: ButtonKeyboardEvent): void => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // иначе сработает клик по кнопке и список закроется без выбора
            const activeOption = options[activeIndex];

            if (activeOption) {
                choose(activeOption);
            }
        }

        if (event.key === 'Escape') {
            // Закрываем только список, а модалку, в которой стоит Select, — нет.
            // stopPropagation: Escape не дойдёт до обработчика модалки.
            // preventDefault: браузер сам не закроет <dialog> по Escape.
            event.stopPropagation();
            event.preventDefault();
            close();
        }

        if (event.key === 'Tab') {
            close();
        }
    };

    // Все нажатия клавиш на поле: решаем, какой обработчик вызвать
    const handleKeyDown = (event: ButtonKeyboardEvent): void => {
        const isTyping = typedRef.current !== '';

        if (isSearchKey(event, isTyping)) {
            handleSearchKey(event);

            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            handleArrowKey(event);

            return;
        }

        // Закрытый список Enter и пробел открывают обычным кликом по кнопке,
        // поэтому остальные клавиши нужны только в открытом списке
        if (isOpen) {
            handleOpenListKey(event);
        }
    };

    return {
        rootRef,
        listId,
        isOpen,
        activeIndex,
        selectedOption,
        getOptionId,
        toggle,
        choose,
        highlight,
        handleKeyDown,
    };
};
