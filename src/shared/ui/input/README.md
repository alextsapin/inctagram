# Input

Универсальное текстовое поле для интерфейса Inctagram.

## Назначение

`Input` — общий UI-компонент для ввода данных: username, email, пароль и другие поля форм.

Компонент лежит в слое `shared` архитектуры FSD, потому что это переиспользуемый элемент без привязки к конкретной фиче (Sign In, Sign Up и т.д.). Его можно импортировать из любого слоя выше: `features`, `widgets`, `pages`.

Используй `Input`, когда нужен нативный `<input>` с единым оформлением проекта и опциональным переключателем видимости пароля. Не создавай локальные копии полей в фичах — бери этот компонент.

Сам `Input` отвечает только за поле ввода, внешний вид, состояния и показ/скрытие пароля. Подпись (`label`), правила валидации, текст ошибки и отправку формы размещай снаружи — в фиче.

## Импорт

```tsx
import { Input } from '@/shared/ui/input';
```

Импортируй только через публичный API слайса (`index.ts`). Не пиши пути вида `@/shared/ui/input/ui/Input`: внутреннее устройство папки может измениться, а публичный экспорт останется стабильным.

## Свойства (Props)

| Prop | Тип | По умолчанию | Назначение |
|---|---|---|---|
| `type` | стандартный HTML | `text` | Тип поля (`text`, `email`, `password` и др.) |
| `error` | `boolean` | `false` | Красная рамка ошибочного состояния |
| `showPasswordToggle` | `boolean` | `false` | Кнопка показа/скрытия пароля |
| `disabled` | `boolean` | `false` | Отключение поля |
| `readOnly` | `boolean` | `false` | Только чтение |
| `className` | `string` | — | Дополнительные CSS-классы на сам `<input>` |
| `onChange` | Обработчик React | — | Реакция на изменение значения |
| `onBlur` | Обработчик React | — | Реакция на потерю фокуса |
| `ref` | `Ref<HTMLInputElement>` | — | Доступ к нативному input |

Также поддерживаются остальные стандартные HTML-атрибуты `<input>` (например `id`, `name`, `placeholder`, `value`, `defaultValue`, `autoComplete`, `aria-invalid`, `aria-describedby`), потому что пропсы расширяют `React.ComponentPropsWithRef<'input'>`.

Кастомные пропсы `error` и `showPasswordToggle` в DOM не передаются.

`className` всегда применяется к самому `<input>`, а не к обёртке с кнопкой пароля.

## Практические примеры

### 1. Обычное текстовое поле

```tsx
<label htmlFor="username">Username</label>
<Input id="username" placeholder="Username" />
```

### 2. Email

```tsx
<label htmlFor="email">Email</label>
<Input id="email" type="email" placeholder="Email" autoComplete="email" />
```

### 3. Password с переключателем видимости

```tsx
<label htmlFor="password">Password</label>
<Input id="password" type="password" showPasswordToggle />
```

Поведение переключателя:

- По умолчанию символы скрыты.
- Клик по иконке глаза показывает пароль; повторный клик скрывает.
- Кнопка имеет `type="button"` и не отправляет форму.
- `aria-label` — `Show password` или `Hide password` в зависимости от состояния.
- При `disabled` недоступны и поле, и кнопка.
- Переключатель появляется только при `type="password"` вместе с `showPasswordToggle`.

**Важно:** если включён `showPasswordToggle`, не оборачивай весь блок (поле + кнопка) в HTML `<label>`. Связывай подпись через `htmlFor` и `id`, как в примере выше.

### 4. Поле с ошибкой

```tsx
<label htmlFor="email">Email</label>
<Input
    id="email"
    type="email"
    error
    aria-invalid
    aria-describedby="email-error"
/>
<span id="email-error">Email is required</span>
```

- `error` — только визуальная красная рамка.
- Текст ошибки рендерит родитель.
- `aria-describedby` связывает поле с сообщением для скринридеров.

### 5. React Hook Form через `register`

В универсальный `Input` не встраивается React Hook Form. Подключай его снаружи через `{...register('fieldName')}`:

```tsx
'use client';

import { useForm } from 'react-hook-form';

import { Input } from '@/shared/ui/input';

type FormValues = {
    username: string;
    password: string;
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
            <label htmlFor="username">Username</label>
            <Input
                id="username"
                error={!!errors.username}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
                {...register('username', {
                    required: 'Username is required',
                })}
            />
            {errors.username && (
                <span id="username-error">{errors.username.message}</span>
            )}

            <label htmlFor="password">Password</label>
            <Input
                id="password"
                type="password"
                showPasswordToggle
                error={!!errors.password}
                aria-invalid={!!errors.password}
                {...register('password', {
                    required: 'Password is required',
                })}
            />

            <button type="submit">Submit</button>
        </form>
    );
};
```

`register` передаёт `name`, `onChange`, `onBlur` и `ref`. Компонент прокидывает их в нативный `<input>`, поэтому валидация и `handleSubmit` работают как обычно. Переключение видимости пароля не меняет значение поля и не ломает эти обработчики.

### 6. Controlled и uncontrolled

Uncontrolled — браузер сам хранит значение:

```tsx
<Input id="nickname" defaultValue="guest" />
```

Controlled — значение хранится снаружи:

```tsx
const [email, setEmail] = useState('');

<Input
    id="email"
    type="email"
    value={email}
    onChange={event => setEmail(event.target.value)}
/>
```

Не смешивай полноценный controlled-режим (`value`) и `defaultValue` в одном экземпляре.

### 7. `ref` и свой `className`

`ref` всегда указывает на нативный `<input>` — даже когда рядом есть кнопка показа пароля:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef} id="search" />
```

Свой класс вместе с SCSS Modules:

```tsx
import { Input } from '@/shared/ui/input';

import css from './form.module.scss';

<Input className={css.extra} id="title" />
```

Классы компонента и твой `className` объединяются: базовые стили Input сохраняются, локальный класс добавляет или переопределяет нужное.

### 8. Отключённое и read-only поле

```tsx
<Input id="locked" disabled />

<Input id="preview" defaultValue="Read only value" readOnly />
```

## Состояния поля

Визуальные состояния уже описаны в `input.module.scss`. При использовании компонента отдельно прописывать hover/focus/error/disabled в своём SCSS не нужно.

| Состояние | Как работает |
|---|---|
| Default | Фон `#171717`, рамка `#4C4C4C`, высота `36px`. |
| Hover | Рамка светлеет (если поле не `disabled` и не `readOnly`). |
| Focus | Рамка и outline `#397DF6` через `:focus-visible`. |
| Error | Красная рамка `#CC1439`. При фокусе ошибочного поля остаётся error-оформление. |
| Disabled | Приглушённые цвета и `cursor: not-allowed`. |
| ReadOnly | Поле видно, но не редактируется; отличается от `disabled`. |

## Input и label

- Для обычных полей связывай подпись через `<label htmlFor="...">` и `id` у `Input`.
- Для пароля с `showPasswordToggle` тот же подход обязателен: кнопка глаза не должна оказаться внутри HTML `<label>`.
- Текст ошибки, Checkbox, Button и ссылки — ответственность родительской формы, не `Input`.

## Использование в Next.js

У `Input` стоит `'use client'`, потому что внутри есть состояние видимости пароля.

Если родитель передаёт обработчики вроде `onChange` или использует React Hook Form, `'use client'` нужен у **родителя** (например у формы). Сам Input уже клиентский:

```tsx
'use client';

import { Input } from '@/shared/ui/input';

export const Example = (): React.JSX.Element => {
    return <Input id="name" onChange={() => undefined} />;
};
```

## Ограничения текущего API

Сейчас у компонента нет свойств вроде `label`, `errorMessage`, `size`, `variant`, `loading`. Если они понадобятся — это отдельная доработка дизайн-системы, а не локальный хак в фиче.

Валидацию и React Hook Form в универсальный `Input` не встраивай.
