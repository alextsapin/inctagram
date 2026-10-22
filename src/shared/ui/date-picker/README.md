# DatePicker и DateRangePicker

Универсальные поля выбора даты для интерфейса Inctagram.

## Назначение

-   `DatePicker` — выбор **одной даты**: дата рождения, дата публикации и т.д.
-   `DateRangePicker` — выбор **периода** из двух дат: начало и конец (например, фильтр статистики).

Оба компонента лежат в слое `shared` архитектуры FSD, потому что это переиспользуемые элементы без привязки к конкретной фиче. Их можно импортировать из любого слоя выше: `features`, `widgets`, `pages`.

Поле — это кнопка с датой и иконкой календаря. По клику открывается календарь, дату выбирают в нём. Ввод даты с клавиатуры не предусмотрен.

Сами компоненты отвечают только за поле, календарь и их состояния. Подпись (`label`), правила валидации, текст ошибки и отправку формы размещай снаружи — в фиче. Так же устроены `Input` и `Textarea`.

Календарь построен на библиотеке [`@daypicker/react`](https://daypicker.dev): она отвечает за сетку месяца, листание и выбор дат, а весь внешний вид задан нашими стилями по макету Figma.

## Импорт

```tsx
import { DatePicker, DateRangePicker } from '@/shared/ui/date-picker';
```

Импортируй только через публичный API слайса (`index.ts`). Не пиши пути вида `@/shared/ui/date-picker/ui/DatePicker`: внутреннее устройство папки может измениться, а публичный экспорт останется стабильным.

Тип периода берётся из библиотеки:

```tsx
import { type DateRange } from '@daypicker/react';
```

## Свойства (Props)

### DatePicker

| Prop          | Тип                    | По умолчанию | Назначение                                |
| ------------- | ---------------------- | ------------ | ----------------------------------------- |
| `value`       | `Date`                 | —            | Выбранная дата                            |
| `onChange`    | `(date: Date) => void` | —            | Вызывается при выборе даты (обязательный) |
| `id`          | `string`               | —            | id кнопки — для связи с `<label htmlFor>` |
| `placeholder` | `string`               | `dd/mm/yyyy` | Текст, пока дата не выбрана               |
| `error`       | `boolean`              | `false`      | Красная рамка, текст и иконка             |
| `disabled`    | `boolean`              | `false`      | Отключение поля                           |

### DateRangePicker

| Prop          | Тип                          | По умолчанию              | Назначение                                        |
| ------------- | ---------------------------- | ------------------------- | ------------------------------------------------- |
| `value`       | `DateRange`                  | —                         | Выбранный период: `{ from, to }`                  |
| `onChange`    | `(range: DateRange) => void` | —                         | Вызывается при каждом клике по дню (обязательный) |
| `id`          | `string`                     | —                         | id кнопки — для связи с `<label htmlFor>`         |
| `placeholder` | `string`                     | `dd/mm/yyyy - dd/mm/yyyy` | Текст, пока период не выбран                      |
| `error`       | `boolean`                    | `false`                   | Красная рамка, текст и иконка                     |
| `disabled`    | `boolean`                    | `false`                   | Отключение поля                                   |

Оба компонента управляемые (controlled): выбранное значение хранит родитель в `value` и обновляет в `onChange`.

## Как работает выбор

### Одна дата

1. Клик по полю открывает календарь на месяце выбранной даты (или текущем месяце).
2. Клик по дню — дата появляется в поле, календарь закрывается.

### Период

1. Первый клик по дню — начало периода. В поле: `12/10/2026 - `.
2. Второй клик — конец периода. В поле: `12/10/2026 - 23/10/2026`, в календаре синяя полоса.
3. Если второй клик раньше начала, даты меняются местами.
4. Календарь **не закрывается** после выбора, чтобы был виден выбранный период.
5. Следующий клик по дню начинает новый период.

### Закрытие календаря

-   клик мимо календаря;
-   клавиша Escape;
-   повторный клик по полю.

Внутри `Modal` Escape при открытом календаре закрывает **только календарь**, второй Escape закрывает окно. Закрытие делает общий хук `useCloseOnOutsideClick` из `@/shared/lib`: он ловит Escape раньше модалки и останавливает его.

## Практические примеры

### 1. Одна дата

```tsx
const [birthday, setBirthday] = useState<Date>();

<label htmlFor="birthday">Date of birth</label>
<DatePicker id="birthday" value={birthday} onChange={setBirthday} />
```

### 2. Период

```tsx
import { type DateRange } from '@daypicker/react';

const [period, setPeriod] = useState<DateRange>();

<label htmlFor="period">Date range</label>
<DateRangePicker id="period" value={period} onChange={setPeriod} />
```

Пока выбрано только начало, `period.to` равен `undefined`. Перед отправкой проверяй, что выбраны обе даты:

```tsx
const isPeriodSelected = Boolean(period?.from && period.to);
```

### 3. Поле с ошибкой

```tsx
<label htmlFor="birthday">Date of birth</label>
<DatePicker id="birthday" value={birthday} onChange={setBirthday} error />
<span>A user under 13 cannot create a profile</span>
```

-   `error` — только визуальное оформление.
-   Текст ошибки рендерит родитель.

### 4. React Hook Form через `Controller`

`register` здесь не подходит: поле — не нативный `<input>`, а значение — объект `Date`. Используй `Controller`:

```tsx
'use client';

import { Controller, useForm } from 'react-hook-form';

import { DatePicker } from '@/shared/ui/date-picker';

type FormValues = {
    birthday: Date;
};

export const ExampleForm = (): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    return (
        <form onSubmit={handleSubmit(console.log)}>
            <label htmlFor="birthday">Date of birth</label>
            <Controller
                name="birthday"
                control={control}
                rules={{ required: 'Date of birth is required' }}
                render={({ field }) => (
                    <DatePicker
                        id="birthday"
                        value={field.value}
                        onChange={field.onChange}
                        error={!!errors.birthday}
                    />
                )}
            />
            {errors.birthday && <span>{errors.birthday.message}</span>}

            <button type="submit">Save</button>
        </form>
    );
};
```

### 5. Отключённое поле

```tsx
<DatePicker value={birthday} onChange={setBirthday} disabled />
```

## Состояния

Визуальные состояния описаны в `date-picker.module.scss` по макету Figma (компонент Date Picker). Отдельно прописывать их в своём SCSS не нужно.

### Поле

| Состояние | Как выглядит                                             |
| --------- | -------------------------------------------------------- |
| Default   | Фон `#171717`, рамка `#4C4C4C`, плейсхолдер `#8D9094`    |
| Hover     | Рамка светлеет до `#8D9094`                              |
| Focus     | Синяя рамка `#397DF6` через `:focus-visible`             |
| Error     | Красные рамка, текст и иконка `#CC1439`                  |
| Disabled  | Серые текст и иконка `#4C4C4C`, календарь не открывается |

### Дни в календаре

| День                | Как выглядит                                                      |
| ------------------- | ----------------------------------------------------------------- |
| Обычный             | белый                                                             |
| Выходной (Sa, Su)   | красный `#F23D61`                                                 |
| Из соседнего месяца | серый `#8D9094`                                                   |
| Сегодня             | синий `#397DF6`, жирный                                           |
| Выбранный           | синий кружок `#234E99`                                            |
| Период              | синяя полоса `#234E99`: начало и конец скруглены, середина прямая |
| Hover               | синий кружок `#397DF6`                                            |

Неделя начинается с понедельника.

## Как устроены стили

Разметку календаря (таблица, ячейки, кнопки) рисует библиотека. Повесить свой `className` на её элементы напрямую нельзя, а SCSS-модуль переименовывает классы. Поэтому в `ui/calendarProps.ts` библиотеке передаются настоящие имена наших классов через проп `classNames`: слева часть календаря, справа класс из `date-picker.module.scss`. Если нужно поменять вид части календаря — ищи её класс в этом объекте.

Иконка календаря (`ui/CalendarIcon.tsx`) встроена в разметку и использует `currentColor`, поэтому меняет цвет вместе с текстом поля.

## Использование в Next.js

У компонентов стоит `'use client'`, потому что внутри есть состояние «календарь открыт/закрыт». Родитель, который хранит дату в `useState` или использует React Hook Form, тоже должен быть клиентским.

## Ограничения текущего API

-   Нет ввода даты с клавиатуры — только выбор в календаре.
-   Нет ограничений по датам (`minDate`, `maxDate`, запрет будущих дат) — при необходимости это отдельная доработка через проп `disabled` библиотеки.
-   Кнопке передаются только перечисленные пропсы (`id`, `disabled`). Если понадобится, например, `aria-describedby`, его нужно добавить в тип пропсов.

Валидацию и React Hook Form в универсальные компоненты не встраивай.
