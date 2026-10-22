# Textarea

Универсальное многострочное текстовое поле для интерфейса Inctagram.

## Назначение

`Textarea` — общий UI-компонент для ввода длинного текста: описание профиля, комментарий, подпись к посту и другие поля форм, где текст не помещается в одну строку.

Компонент лежит в слое `shared` архитектуры FSD, потому что это переиспользуемый элемент без привязки к конкретной фиче. Его можно импортировать из любого слоя выше: `features`, `widgets`, `pages`.

Используй `Textarea`, когда нужен нативный `<textarea>` с единым оформлением проекта. Для однострочных полей бери [`Input`](../input/README.md). Не создавай локальные копии полей в фичах — бери этот компонент.

Сам `Textarea` отвечает только за поле ввода, внешний вид и состояния. Подпись (`label`), правила валидации, текст ошибки и отправку формы размещай снаружи — в фиче. Так же устроен `Input`.

## Импорт

```tsx
import { Textarea } from '@/shared/ui/textarea';
```

Импортируй только через публичный API слайса (`index.ts`). Не пиши пути вида `@/shared/ui/textarea/ui/Textarea`: внутреннее устройство папки может измениться, а публичный экспорт останется стабильным.

## Свойства (Props)

| Prop          | Тип                        | По умолчанию | Назначение                                          |
| ------------- | -------------------------- | ------------ | --------------------------------------------------- |
| `error`       | `boolean`                  | `false`      | Красная рамка ошибочного состояния и `aria-invalid` |
| `disabled`    | `boolean`                  | `false`      | Отключение поля                                     |
| `placeholder` | `string`                   | —            | Подсказка внутри пустого поля                       |
| `rows`        | `number`                   | —            | Начальная высота в строках (не меньше `84px`)       |
| `maxLength`   | `number`                   | —            | Максимальное количество символов                    |
| `className`   | `string`                   | —            | Дополнительные CSS-классы на сам `<textarea>`       |
| `onChange`    | Обработчик React           | —            | Реакция на изменение значения                       |
| `onBlur`      | Обработчик React           | —            | Реакция на потерю фокуса                            |
| `ref`         | `Ref<HTMLTextAreaElement>` | —            | Доступ к нативному textarea                         |

Также поддерживаются остальные стандартные HTML-атрибуты `<textarea>` (например `id`, `name`, `value`, `defaultValue`, `readOnly`, `aria-describedby`), потому что пропсы расширяют `React.ComponentPropsWithRef<'textarea'>`.

Кастомный проп `error` в DOM не передаётся. Вместо него на `<textarea>` ставится `aria-invalid="true"`, чтобы скринридер сообщил об ошибке. Если передать `aria-invalid` явно, будет использовано переданное значение.

## Практические примеры

### 1. Обычное поле

```tsx
<label htmlFor="about">About me</label>
<Textarea id="about" placeholder="Tell about yourself" />
```

### 2. Поле с ошибкой

```tsx
<label htmlFor="about">About me</label>
<Textarea id="about" error aria-describedby="about-error" />
<span id="about-error">Maximum number of characters 200</span>
```

-   `error` — красная рамка и `aria-invalid`.
-   Текст ошибки рендерит родитель.
-   `aria-describedby` связывает поле с сообщением для скринридеров.

### 3. React Hook Form через `register`

В универсальный `Textarea` не встраивается React Hook Form. Подключай его снаружи через `{...register('fieldName')}`:

```tsx
'use client';

import { useForm } from 'react-hook-form';

import { Textarea } from '@/shared/ui/textarea';

type FormValues = {
    about: string;
};

export const ExampleForm = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onBlur',
    });

    return (
        <form onSubmit={handleSubmit(console.log)}>
            <label htmlFor="about">About me</label>
            <Textarea
                id="about"
                error={!!errors.about}
                aria-describedby={errors.about ? 'about-error' : undefined}
                {...register('about', {
                    maxLength: {
                        value: 200,
                        message: 'Maximum number of characters 200',
                    },
                })}
            />
            {errors.about && <span id="about-error">{errors.about.message}</span>}

            <button type="submit">Save</button>
        </form>
    );
};
```

`register` передаёт `name`, `onChange`, `onBlur` и `ref`. Компонент прокидывает их в нативный `<textarea>`, поэтому валидация и `handleSubmit` работают как обычно.

### 4. Controlled и uncontrolled

Uncontrolled — браузер сам хранит значение:

```tsx
<Textarea id="comment" defaultValue="Nice photo!" />
```

Controlled — значение хранится снаружи:

```tsx
const [comment, setComment] = useState('');

<Textarea
    id="comment"
    value={comment}
    onChange={event => setComment(event.target.value)}
/>;
```

Не смешивай полноценный controlled-режим (`value`) и `defaultValue` в одном экземпляре.

### 5. `ref` и свой `className`

`ref` указывает на нативный `<textarea>`:

```tsx
const textareaRef = useRef<HTMLTextAreaElement>(null);

<Textarea ref={textareaRef} id="description" />;
```

Свой класс вместе с SCSS Modules:

```tsx
import { Textarea } from '@/shared/ui/textarea';

import css from './form.module.scss';

<Textarea className={css.description} id="description" />;
```

Классы компонента и твой `className` объединяются: базовые стили Textarea сохраняются, локальный класс добавляет или переопределяет нужное. Например, так можно задать свою высоту или запретить растягивание (`resize: none`).

### 6. Высота и ограничение длины

```tsx
<Textarea id="about" rows={5} maxLength={200} />
```

-   По умолчанию поле занимает всю ширину родителя и имеет минимальную высоту `84px`, как в макете.
-   Пользователь может растянуть поле вниз мышкой (`resize: vertical`); растягивать вбок нельзя, чтобы не сломать вёрстку.
-   `maxLength` не даёт ввести больше символов. Если нужно показать сообщение об ошибке, добавь правило `maxLength` в `register` (пример 3).

### 7. Отключённое поле

```tsx
<Textarea id="locked" disabled defaultValue="You cannot edit this" />
```

## Состояния поля

Визуальные состояния уже описаны в `textarea.module.scss` по макету Figma (компонент Text-Area). При использовании компонента отдельно прописывать focus/error/disabled в своём SCSS не нужно.

| Состояние | Как работает                                                                   |
| --------- | ------------------------------------------------------------------------------ |
| Default   | Фон `#171717`, рамка 1px `#4C4C4C`, текст 16px / 24px, плейсхолдер `#8D9094`.  |
| Hover     | Без изменений — как в макете.                                                  |
| Active    | Белая рамка `#FFFFFF` в момент нажатия на поле (`:active`).                    |
| Focus     | Синяя рамка `#2F68CC` толщиной 2px через `:focus-visible`.                     |
| Error     | Красная рамка `#CC1439`. При фокусе ошибочного поля остаётся error-оформление. |
| Disabled  | Текст и плейсхолдер `#4C4C4C`, `cursor: not-allowed`.                          |

## Textarea и label

-   Связывай подпись через `<label htmlFor="...">` и `id` у `Textarea`.
-   В макете подпись (14px, `#8D9094`) стоит над полем, а текст ошибки (14px, `#CC1439`) — под ним. Их рендерит родительская форма, не `Textarea`.

## Использование в Next.js

Сам `Textarea` — обычный презентационный компонент без состояния. Его не обязательно помечать `'use client'`.

Если родитель передаёт обработчики вроде `onChange` или использует React Hook Form, `'use client'` нужен у **родителя** (например у формы):

```tsx
'use client';

import { Textarea } from '@/shared/ui/textarea';

export const Example = (): React.JSX.Element => {
    return <Textarea id="comment" onChange={() => undefined} />;
};
```

## Ограничения текущего API

Сейчас у компонента нет свойств вроде `label`, `errorMessage`, счётчика символов, автоувеличения высоты по тексту. Отдельного оформления для `readOnly` тоже нет. Если они понадобятся — это отдельная доработка дизайн-системы, а не локальный хак в фиче.

Валидацию и React Hook Form в универсальный `Textarea` не встраивай.
