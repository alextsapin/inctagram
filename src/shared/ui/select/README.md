# Select

Универсальный выпадающий список для интерфейса Inctagram.

## Назначение

`Select` — общий UI-компонент для выбора одного значения из списка: страна и город в General information, причина бана и фильтр в админке, язык в шапке.

Компонент лежит в слое `shared` архитектуры FSD, потому что это переиспользуемый элемент без привязки к конкретной фиче. Его можно импортировать из любого слоя выше: `features`, `widgets`, `pages`.

Сам `Select` отвечает только за поле, выпадающий список и их состояния. Подпись (`label`), правила валидации, текст ошибки и отправку формы размещай снаружи, в фиче. Так же устроены `Input`, `Textarea` и `DatePicker`.

Нативный `<select>` здесь не подходит: его открытый список рисует операционная система, и сделать его как в макете (тёмный список, синий пункт под курсором, флаги) нельзя. Поэтому `Select` — своя кнопка со списком, а клавиатура и доступность сделаны по стандарту WAI-ARIA [«select-only combobox»](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/), как у настоящего `<select>`.

## Импорт

```tsx
import { Select, type SelectOption } from '@/shared/ui/select';
```

Импортируй только через публичный API слайса (`index.ts`). Не пиши пути вида `@/shared/ui/select/ui/Select`: внутреннее устройство папки может измениться, а публичный экспорт останется стабильным.

## Свойства (Props)

| Prop          | Тип                       | По умолчанию | Назначение                                        |
| ------------- | ------------------------- | ------------ | ------------------------------------------------- |
| `options`     | `SelectOption[]`          | —            | Пункты списка (обязательный)                      |
| `onChange`    | `(value: string) => void` | —            | Вызывается при выборе пункта (обязательный)       |
| `value`       | `string`                  | —            | `value` выбранного пункта                         |
| `id`          | `string`                  | —            | id поля — для связи с `<label htmlFor>`           |
| `placeholder` | `string`                  | `Select`     | Текст, пока ничего не выбрано                     |
| `disabled`    | `boolean`                 | `false`      | Отключение поля                                   |
| `aria-label`  | `string`                  | —            | Название поля для скринридера, если нет `<label>` |

Пункт списка:

```ts
type SelectOption = {
    value: string; // что придёт в onChange и уйдёт на сервер
    label: string; // что видит пользователь
    icon?: React.ReactNode; // картинка слева от текста, например флаг языка
};
```

Компонент управляемый (controlled): выбранное значение хранит родитель в `value` и обновляет в `onChange`.

Ширина поля — 100% от родителя. Нужна другая ширина — задай её обёртке.

## Как работает

### Мышь

-   Клик по полю открывает список, повторный клик закрывает.
-   Наведение на пункт подсвечивает его, клик выбирает и закрывает список.
-   Клик мимо закрывает список без выбора.

### Клавиатура

Фокус всё время остаётся на поле, по пунктам двигается только подсветка.

| Клавиша         | Список закрыт                                         | Список открыт                                 |
| --------------- | ----------------------------------------------------- | --------------------------------------------- |
| `Enter`, пробел | открыть                                               | выбрать подсвеченный пункт и закрыть          |
| `↓`, `↑`        | открыть                                               | подсветить следующий / предыдущий пункт       |
| `Escape`        | —                                                     | закрыть без выбора                            |
| `Tab`           | перейти к следующему полю                             | закрыть и перейти к следующему полю           |
| Буквы и цифры   | сразу выбрать подходящий пункт, список не открывается | подсветить подходящий пункт, выбор по `Enter` |

-   При открытии подсвечен выбранный пункт, а если ничего не выбрано — первый.
-   Дальше первого и последнего пункта подсветка не уходит.
-   Длинный список (больше 6 пунктов) прокручивается так, чтобы подсвеченный пункт был виден.

### Поиск по буквам

Работает как в нативном `<select>`:

-   `k` — первый пункт после текущего, который начинается на K (Kazakhstan). Дойдя до конца списка, поиск продолжается с начала.
-   Быстро набранные буквы складываются: `ky` — Kyrgyzstan.
-   Та же буква несколько раз подряд перебирает пункты на неё: `k`, `k`, `k` — Kazakhstan, Kenya, Kyrgyzstan.
-   После паузы в полсекунды набор начинается заново.
-   Пробел во время набора — часть слова: `united k` — United Kingdom. Пробел без набора, как обычно, открывает список или выбирает пункт.
-   Сочетания с Ctrl, Cmd и Alt не перехватываются.
-   Регистр не важен. Ищется по `label`, а не по `value`.

### Скринридер

Поле — `role="combobox"`, список — `role="listbox"`, пункты — `role="option"` с `aria-selected`. Подсвеченный пункт сообщается через `aria-activedescendant`. Скринридер прочитает, например: «Select your country, Belarus, список».

У поля обязательно должно быть название, иначе скринридер прочитает просто «список». Есть два способа:

-   видимая подпись `<label htmlFor="...">` и тот же `id` у `Select` (как в General information);
-   `aria-label`, если подписи на экране нет по макету (выбор языка в шапке, причина бана в Ban user).

## Практические примеры

### 1. Обычный выбор

```tsx
const countries: SelectOption[] = [
    { value: 'by', label: 'Belarus' },
    { value: 'kz', label: 'Kazakhstan' },
    { value: 'ru', label: 'Russia' },
];

const [country, setCountry] = useState<string>();

<label htmlFor="country">Select your country</label>
<Select
    id="country"
    options={countries}
    value={country}
    onChange={setCountry}
    placeholder="Country"
/>
```

### 2. Зависимый список и `disabled`

Пока страна не выбрана, выбирать город нельзя:

```tsx
<label htmlFor="city">Select your city</label>
<Select
    id="city"
    options={cities}
    value={city}
    onChange={setCity}
    placeholder="City"
    disabled={!country}
/>
```

### 3. React Hook Form через `Controller`

`register` здесь не подходит: поле — не нативный `<input>`. Используй `Controller`, как для `DatePicker`:

```tsx
'use client';

import { Controller, useForm } from 'react-hook-form';

import { Select } from '@/shared/ui/select';

type FormValues = {
    country: string;
};

export const ExampleForm = (): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    return (
        <form onSubmit={handleSubmit(console.log)}>
            <label htmlFor="country">Select your country</label>
            <Controller
                name="country"
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                    <Select
                        id="country"
                        options={countries}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Country"
                    />
                )}
            />
            {errors.country && <span>{errors.country.message}</span>}

            <button type="submit">Save</button>
        </form>
    );
};
```

### 4. Пункты с картинкой: выбор языка

Вариант `Language` из макета. Картинку передаём в `icon`, она показывается и в пунктах, и в выбранном значении:

```tsx
import Image from 'next/image';

import ru from '../assets/ru.png';
import uk from '../assets/uk.png';

const FLAG_SIZE = 20;

const languages: SelectOption[] = [
    {
        value: 'en',
        label: 'English',
        icon: <Image src={uk} width={FLAG_SIZE} height={FLAG_SIZE} alt="" />,
    },
    {
        value: 'ru',
        label: 'Russian',
        icon: <Image src={ru} width={FLAG_SIZE} height={FLAG_SIZE} alt="" />,
    },
];

<div className={css.language}>
    <Select
        options={languages}
        value={language}
        onChange={setLanguage}
        aria-label="Language"
    />
</div>;
```

```scss
.language {
    width: 163px; /* ширина из макета */
}
```

-   `alt=""`: флаг — украшение, название языка уже есть в тексте.
-   `aria-label="Language"`: в шапке у поля нет видимой подписи, а скринридеру нужно знать, что это за поле.

### 5. Внутри модалки

`Select` можно ставить в `Modal`, например в окно Ban user. Escape при открытом списке закрывает **только список**, второй Escape закрывает окно.

Открытый список ложится поверх содержимого окна, но должен помещаться внутри него: иначе у окна появится прокрутка. Поэтому ниже поля оставляй место под список, как в макете. Готовый пример окна Ban user — в [README Modal](../modal/README.md), раздел 3.

## Состояния

Визуальные состояния описаны в `select.module.scss` по макету Figma (компонент Select-box). Отдельно прописывать их в своём SCSS не нужно.

| Состояние          | Как выглядит                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Default            | рамка 1px `#4C4C4C`, скругление 2px, высота 36px, текст 16px / 24px, плейсхолдер `#8D9094`                 |
| Hover              | рамка `#8D9094`                                                                                            |
| Открыт             | поле и список: фон `#171717`, белая рамка, стрелка вверх. Тень списка — два слоя 10% чёрного, как в макете |
| Подсвеченный пункт | фон `#333333`, текст `#397DF6`                                                                             |
| Focus              | синяя обводка 2px `#397DF6` через `:focus-visible`                                                         |
| Disabled           | текст `#4C4C4C`, не открывается                                                                            |

В списке видно 6 пунктов, дальше прокрутка.

## Как устроен код

Вид и логика разделены: компонент только рисует, а как он себя ведёт, решает хук.

```text
select/
├── lib/
│   ├── useSelect.ts             ← логика: открыт / закрыт, подсветка, клавиатура, поиск по буквам
│   ├── findOptionByText.ts      ← поиск пункта по набранным буквам (по кругу)
│   ├── isSearchKey.ts           ← нужна ли нажатая клавиша для поиска по буквам
│   ├── isSameLetterRepeated.ts  ← набрана ли одна буква несколько раз («kkk»)
│   └── types.ts                 ← тип SelectOption
├── ui/
│   ├── Select.tsx               ← разметка: кнопка, список, классы
│   ├── ArrowIcon.tsx            ← стрелка из Figma
│   └── select.module.scss       ← стили
├── index.ts
└── README.md
```

-   `lib/useSelect.ts` — хук со всем поведением. Какой пункт подсвечен, хранит `activeIndex`: его меняют мышь, стрелки и поиск по буквам, поэтому подсветка одна на все способы. Набранные буквы хранятся в `useRef` и сбрасываются таймером через `SEARCH_RESET_DELAY` (500 мс). Нажатия клавиш разобраны по трём обработчикам: `handleSearchKey` (буквы), `handleArrowKey` (стрелки), `handleOpenListKey` (Enter, пробел и Tab в открытом списке), а `handleKeyDown` только решает, какой из них вызвать. Хук возвращает компоненту всё, что нужно для разметки: `isOpen`, `activeIndex`, `selectedOption`, обработчики `toggle`, `choose`, `highlight`, `handleKeyDown`.
-   `lib/findOptionByText.ts`, `lib/isSearchKey.ts`, `lib/isSameLetterRepeated.ts` — маленькие функции без React. Каждая отвечает на один вопрос, их легко читать и проверять отдельно.
-   `ui/Select.tsx` — только JSX и классы. Чтобы поменять вид, не нужно разбираться в клавиатуре, и наоборот.
-   `ui/ArrowIcon.tsx` — стрелка из Figma (`arrow-ios-Down-outline`) с `currentColor`. В открытом списке её поворачивает CSS.
-   Закрытие по клику мимо и по Escape делает общий хук `useCloseOnOutsideClick` из `@/shared/lib`, им же пользуется `DatePicker`. Escape хук ловит на перехвате (capture), раньше модалки, поэтому в `Modal` он закрывает только список.

## Использование в Next.js

У компонента стоит `'use client'`, потому что внутри есть состояние «список открыт / закрыт». Родитель, который хранит значение в `useState` или использует React Hook Form, тоже должен быть клиентским.

## Ограничения текущего API

-   Выбирается одно значение. Множественного выбора нет.
-   Нет поля ввода, которое фильтрует список. Поиск по буквам только подсвечивает или выбирает пункт, список не сокращается.
-   Нет состояния `error`: в макете его нет. Если понадобится, это отдельная доработка.
-   Список всегда открывается вниз. Если под полем мало места (например, у нижнего края модалки), список не перевернётся наверх.

Валидацию и React Hook Form в универсальный `Select` не встраивай.
