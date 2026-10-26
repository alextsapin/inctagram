import { type PropsBase } from '@daypicker/react';

import css from './date-picker.module.scss';

const SUNDAY = 0;
const MONDAY = 1;
const SATURDAY = 6;

// Общие настройки календаря для DatePicker и DateRangePicker
export const calendarProps: PropsBase = {
    weekStartsOn: MONDAY,
    showOutsideDays: true, // показываем дни соседних месяцев
    // Отдельный признак для выходных: им библиотека добавит класс .weekend (красный цвет)
    modifiers: { weekend: { dayOfWeek: [SUNDAY, SATURDAY] } },
    modifiersClassNames: { weekend: css.weekend },
    // Разметку календаря (таблица, ячейки, кнопки) рисует библиотека, а не мы,
    // поэтому повесить на её элементы свой className напрямую нельзя.
    // К тому же SCSS-модуль переименовывает классы (.day → date-picker-module__xxx__day).
    // Здесь мы передаём библиотеке настоящие имена наших классов:
    // слева — часть календаря, справа — класс из date-picker.module.scss.
    classNames: {
        root: css.calendar,
        months: css.months,
        nav: css.nav,
        button_previous: css['nav-button'],
        button_next: css['nav-button'],
        chevron: css.chevron,
        month_caption: css.caption,
        month_grid: css['month-grid'],
        weekday: css.weekday,
        day: css.day,
        day_button: css['day-button'],
        today: css.today,
        outside: css.outside,
        selected: css.selected,
        range_start: css['range-start'],
        range_middle: css['range-middle'],
        range_end: css['range-end'],
    },
};
