'use client';

import { useRef, useState } from 'react';

import { DayPicker } from '@daypicker/react';

import { useCloseOnOutsideClick } from '@/shared/lib';

import { formatDate } from '../lib/formatDate';

import { CalendarIcon } from './CalendarIcon';
import { calendarProps } from './calendarProps';
import css from './date-picker.module.scss';

type DatePickerProps = {
    value?: Date;
    onChange: (date: Date) => void;
    id?: string;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    // Растянуть поле на всю ширину родителя, например в форме настроек профиля
    fullWidth?: boolean;
};

export const DatePicker = ({
    value,
    onChange,
    id,
    placeholder = 'dd/mm/yyyy',
    error = false,
    disabled = false,
    fullWidth = false,
}: DatePickerProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const openOrClose = (): void => setIsOpen(!isOpen);
    const close = (): void => setIsOpen(false);

    useCloseOnOutsideClick(rootRef, isOpen, close);

    // Библиотека передаёт два аргумента: выбранную дату и день, по которому кликнули.
    // Берём второй: так повторный клик по выбранному дню не сбрасывает дату.
    const handleSelect = (_selected: Date | undefined, clickedDay: Date): void => {
        onChange(clickedDay);
        close();
    };

    const fieldClass = error ? `${css.field} ${css.error}` : css.field;
    const rootClass = fullWidth ? `${css.root} ${css['full-width']}` : css.root;

    return (
        <div ref={rootRef} className={rootClass}>
            <button
                id={id}
                type="button"
                className={fieldClass}
                disabled={disabled}
                aria-expanded={isOpen}
                onClick={openOrClose}
            >
                {value ? (
                    <span>{formatDate(value)}</span>
                ) : (
                    <span className={css.placeholder}>{placeholder}</span>
                )}
                <CalendarIcon />
            </button>

            {isOpen && (
                <div className={css.popup}>
                    <DayPicker
                        {...calendarProps}
                        mode="single"
                        selected={value}
                        defaultMonth={value}
                        onSelect={handleSelect}
                    />
                </div>
            )}
        </div>
    );
};
