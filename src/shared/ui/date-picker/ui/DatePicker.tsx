'use client';

import { useRef, useState } from 'react';

import { DayPicker } from '@daypicker/react';

import { useCloseOnOutsideClick } from '@/shared/lib';

import { formatDate } from '../lib/formatDate';
import { maskDate } from '../lib/maskDate';
import { parseDate } from '../lib/parseDate';

import { CalendarIcon } from './CalendarIcon';
import { calendarProps } from './calendarProps';
import css from './date-picker.module.scss';

type DatePickerProps = {
    value?: Date;
    // Получает дату, когда её выбрали в календаре или ввели полностью,
    // и undefined, когда поле очистили
    onChange: (date: Date | undefined) => void;
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

    // Что напечатано в поле. Хранится отдельно от value:
    // пока человек печатает «12/12/19», это ещё не дата
    const [text, setText] = useState(value ? formatDate(value) : '');

    // Какой месяц показывает календарь. Нужен, чтобы календарь
    // сам переходил на дату, которую ввели с клавиатуры
    const [month, setMonth] = useState(value ?? new Date());

    const openOrClose = (): void => {
        // При открытии показываем месяц выбранной даты, а если её нет — текущий
        setMonth(value ?? new Date());
        setIsOpen(!isOpen);
    };

    const close = (): void => setIsOpen(false);

    useCloseOnOutsideClick(rootRef, isOpen, close);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const masked = maskDate(event.target.value);
        const date = parseDate(masked);

        setText(masked);

        if (masked === '') {
            onChange(undefined);
        } else if (date) {
            onChange(date);
            setMonth(date);
        }
    };

    // Ушли из поля, а дата не дописана или такой нет (31/02/1989):
    // возвращаем последнюю правильную дату, чтобы поле и форма не расходились
    const handleBlur = (): void => {
        if (!parseDate(text)) {
            setText(value ? formatDate(value) : '');
        }
    };

    // Библиотека передаёт два аргумента: выбранную дату и день, по которому кликнули.
    // Берём второй: так повторный клик по выбранному дню не сбрасывает дату.
    const handleSelect = (_selected: Date | undefined, clickedDay: Date): void => {
        onChange(clickedDay);
        setText(formatDate(clickedDay));
        close();
    };

    const fieldClass = error ? `${css.field} ${css.error}` : css.field;
    const rootClass = fullWidth ? `${css.root} ${css['full-width']}` : css.root;

    return (
        <div ref={rootRef} className={rootClass}>
            <div className={`${fieldClass} ${css.typed}`}>
                <input
                    id={id}
                    className={css.input}
                    // Цифровая клавиатура на телефоне
                    inputMode="numeric"
                    placeholder={placeholder}
                    value={text}
                    disabled={disabled}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                />

                <button
                    type="button"
                    className={css['icon-button']}
                    aria-label="Open calendar"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    onClick={openOrClose}
                >
                    <CalendarIcon />
                </button>
            </div>

            {isOpen && (
                <div className={css.popup}>
                    <DayPicker
                        {...calendarProps}
                        mode="single"
                        selected={value}
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={handleSelect}
                    />
                </div>
            )}
        </div>
    );
};
