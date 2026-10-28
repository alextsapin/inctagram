'use client';

import { useRef, useState } from 'react';

import { DayPicker, type DateRange } from '@daypicker/react';

import { useCloseOnOutsideClick } from '@/shared/lib';

import { formatDate } from '../lib/formatDate';

import { CalendarIcon } from './CalendarIcon';
import { calendarProps } from './calendarProps';
import css from './date-picker.module.scss';

type DateRangePickerProps = {
    value?: DateRange;
    onChange: (range: DateRange) => void;
    id?: string;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
};

export const DateRangePicker = ({
    value,
    onChange,
    id,
    placeholder = 'dd/mm/yyyy - dd/mm/yyyy',
    error = false,
    disabled = false,
}: DateRangePickerProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const openOrClose = (): void => setIsOpen(!isOpen);
    const close = (): void => setIsOpen(false);

    useCloseOnOutsideClick(rootRef, isOpen, close);

    // Библиотека передаёт два аргумента: выбранный период и день, по которому кликнули.
    // Берём второй и сами решаем, начало это или конец периода.
    // Календарь после выбора не закрываем, чтобы пользователь видел выбранный период.
    // Закрыть его можно кликом мимо, клавишей Esc или повторным кликом по полю.
    const handleSelect = (_selected: DateRange | undefined, clickedDay: Date): void => {
        const start = value?.from;
        const end = value?.to;

        if (!start || end) {
            // Начала ещё нет или период уже выбран целиком — начинаем новый период
            onChange({ from: clickedDay, to: undefined });
        } else if (clickedDay < start) {
            // Кликнули раньше начала — меняем даты местами
            onChange({ from: clickedDay, to: start });
        } else {
            // Начало уже есть — этот клик выбирает конец периода
            onChange({ from: start, to: clickedDay });
        }
    };

    // Текст в поле: "12/10/2026 - 23/10/2026", пока выбрано только начало — "12/10/2026 - "
    let text = '';

    if (value?.from) {
        text = `${formatDate(value.from)} - `;
    }

    if (value?.from && value.to) {
        text += formatDate(value.to);
    }

    const fieldClass = error ? `${css.field} ${css.error}` : css.field;

    return (
        <div ref={rootRef} className={css.root}>
            <button
                id={id}
                type="button"
                className={fieldClass}
                disabled={disabled}
                aria-expanded={isOpen}
                onClick={openOrClose}
            >
                {text ? (
                    <span>{text}</span>
                ) : (
                    <span className={css.placeholder}>{placeholder}</span>
                )}
                <CalendarIcon />
            </button>

            {isOpen && (
                <div className={css.popup}>
                    <DayPicker
                        {...calendarProps}
                        mode="range"
                        selected={value}
                        defaultMonth={value?.from}
                        onSelect={handleSelect}
                    />
                </div>
            )}
        </div>
    );
};
