'use client';

import { useId, useRef } from 'react';

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
    // Содержимое выбранного таба. Компонент покажет его под табами.
    // Без children под табами ничего нет, как у Week / Month в Statistics
    children?: React.ReactNode;
};

export const Tabs = ({
    options,
    value,
    onChange,
    fullWidth = false,
    // Имя с дефисом нельзя сделать переменной, поэтому при разборе пропсов переименовываем
    'aria-label': ariaLabel,
    children,
}: TabsProps): React.JSX.Element => {
    // Блок с табами: через него находим кнопку, на которую перевести фокус
    const listRef = useRef<HTMLDivElement>(null);

    // Уникальный id от React: из него строим id табов и панели,
    // чтобы они ссылались друг на друга (aria-controls и aria-labelledby)
    const baseId = useId();
    const panelId = `${baseId}-panel`;
    const getTabId = (index: number): string => `${baseId}-tab-${index}`;

    // Панель рисуем, только если передали содержимое
    const hasPanel = children !== undefined;

    const selectedIndex = options.findIndex(option => option.value === value);

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
        <>
            <div
                ref={listRef}
                role="tablist"
                aria-label={ariaLabel}
                className={listClass}
            >
                {options.map((option, index) => {
                    const isSelected = option.value === value;

                    return (
                        <button
                            key={option.value}
                            id={getTabId(index)}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            // Таб указывает, каким блоком он управляет. Панель одна на все табы
                            aria-controls={hasPanel ? panelId : undefined}
                            tabIndex={option.value === focusableValue ? 0 : -1}
                            className={
                                isSelected ? `${css.tab} ${css.selected}` : css.tab
                            }
                            disabled={option.disabled}
                            onClick={() => onChange(option.value)}
                            onKeyDown={event => handleKeyDown(event, index)}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {/* Скринридер читает название панели по выбранному табу */}
            {hasPanel && (
                <div
                    role="tabpanel"
                    id={panelId}
                    aria-labelledby={getTabId(selectedIndex)}
                >
                    {children}
                </div>
            )}
        </>
    );
};
