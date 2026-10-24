'use client';

import { useRef } from 'react';

import { getNextTabIndex } from '../lib/getNextTabIndex';
import { type TabOption } from '../lib/types';

import css from './tabs.module.scss';

type TabsProps = {
    options: TabOption[];
    value: string; // value выбранного таба
    onChange: (value: string) => void;
    // Табы делят всю ширину поровну, как в Profile Settings.
    // Без него ширина по тексту, как Week / Month в Statistics
    fullWidth?: boolean;
    // Название группы табов для скринридера, например «Profile settings»
    'aria-label'?: string;
};

// Только кнопки табов. Что показывать под ними, решает страница по value
export const Tabs = ({
    options,
    value,
    onChange,
    fullWidth = false,
    // Имя с дефисом нельзя сделать переменной, поэтому при разборе пропсов переименовываем
    'aria-label': ariaLabel,
}: TabsProps): React.JSX.Element => {
    // Блок с табами: через него находим кнопку, на которую перевести фокус
    const listRef = useRef<HTMLDivElement>(null);

    // Клавишей Tab в группу попадаем только на один таб: на выбранный,
    // а если он отключён или не найден — на первый доступный.
    // Между табами ходят стрелками (так устроены табы по стандарту WAI-ARIA)
    const isSelectedEnabled = options.some(
        option => option.value === value && !option.disabled,
    );
    const focusableValue = isSelectedEnabled
        ? value
        : options.find(option => !option.disabled)?.value;

    // index — номер таба, на котором нажали клавишу
    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        index: number,
    ): void => {
        const nextIndex = getNextTabIndex(event.key, options, index);

        // Клавиша не для табов, например Enter или буква: ничего не делаем
        if (nextIndex === null) return;

        // Не даём Home / End прокручивать страницу
        event.preventDefault();
        onChange(options[nextIndex].value);
        // Кнопки в разметке идут в том же порядке, что и options
        listRef.current?.querySelectorAll('button')[nextIndex].focus();
    };

    const listClass = fullWidth ? `${css.tabs} ${css['full-width']}` : css.tabs;

    return (
        <div ref={listRef} role="tablist" aria-label={ariaLabel} className={listClass}>
            {options.map((option, index) => {
                const isSelected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        tabIndex={option.value === focusableValue ? 0 : -1}
                        className={isSelected ? `${css.tab} ${css.selected}` : css.tab}
                        disabled={option.disabled}
                        onClick={() => onChange(option.value)}
                        onKeyDown={event => handleKeyDown(event, index)}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
