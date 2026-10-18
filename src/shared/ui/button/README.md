# Button

Универсальная кнопка для интерфейса Inctagram.

## Назначение

`Button` — общий UI-компонент для действий пользователя: отправка формы, подтверждение, отмена, второстепенные действия на экране.

Компонент лежит в слое `shared` архитектуры FSD, потому что это переиспользуемый элемент без привязки к конкретной фиче (Sign In, Sign Up и т.д.). Его можно импортировать из любого слоя выше: `features`, `widgets`, `pages`.

Используй `Button`, когда нужен нативный `<button>` с единым оформлением проекта. Не создавай локальные копии кнопки в фичах — бери этот компонент.

## Импорт

```tsx
import { Button } from '@/shared/ui/button';
```

Импортируй только через публичный API слайса (`index.ts`). Не пиши пути вида `@/shared/ui/button/ui/Button`: внутреннее устройство папки может измениться, а публичный экспорт останется стабильным.

Тип варианта кнопки тоже экспортируется оттуда же:

```tsx
import { Button, type ButtonVariant } from '@/shared/ui/button';
```

## Варианты кнопки

У кнопки четыре варианта оформления. Свойство `variant` имеет тип `ButtonVariant`. По умолчанию используется `primary`, поэтому `variant="primary"` можно не указывать.

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
```

| Вариант | Когда уместен |
|---|---|
| `primary` | Главное действие на экране или в форме (Sign Up, Sign In, Save). |
| `secondary` | Второстепенное действие рядом с основным (Cancel, Back). |
| `outlined` | Действие средней важности, когда нужна кнопка с обводкой без заливки. |
| `text` | Лёгкое текстовое действие без сильного визуального акцента. |

## Свойства (Props)

| Prop | Тип | По умолчанию | Назначение |
|---|---|---|---|
| `variant` | `ButtonVariant` | `primary` | Вариант оформления |
| `fullWidth` | `boolean` | `false` | Растягивание на всю ширину |
| `type` | `button` / `submit` / `reset` | `button` | HTML-поведение |
| `disabled` | `boolean` | `false` | Отключение кнопки |
| `className` | `string` | — | Дополнительные CSS-классы |
| `onClick` | Обработчик React | — | Действие при нажатии |
| `children` | `ReactNode` | — | Содержимое кнопки |

Также поддерживаются остальные стандартные HTML-атрибуты `<button>` (например `id`, `aria-label`, `form`), потому что пропсы расширяют `React.ComponentProps<'button'>`.

Кастомные пропсы `variant` и `fullWidth` в DOM не передаются.

## Практические примеры

### 1. Обычная кнопка с `onClick`

```tsx
<Button onClick={() => console.log('clicked')}>
    Click me
</Button>
```

### 2. Кнопка отправки формы (`type="submit"`)

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
    {/* поля формы */}
    <Button type="submit" fullWidth>
        Sign In
    </Button>
</form>
```

### 3. Кнопка внутри формы, которая не отправляет форму

По умолчанию у `Button` стоит `type="button"`. Такую кнопку безопасно класть внутрь `<form>` — она не вызовет submit.

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
    <Button type="button" onClick={handleTogglePassword}>
        Show password
    </Button>

    <Button type="submit" fullWidth>
        Sign In
    </Button>
</form>
```

**Разница `type="button"` и `type="submit"` (важно для React Hook Form):**

- `type="submit"` — браузер отправляет форму, срабатывает `onSubmit` у `<form>`, а вместе с ним `handleSubmit(...)` из React Hook Form.
- `type="button"` — только выполняет `onClick` (если он есть), форма не отправляется.

Если внутри формы забыть указать тип и получить поведение submit по ошибке, валидация и отправка могут запуститься неожиданно. Поэтому для любых кнопок «не отправлять форму» явно используй `type="button"` (или полагайся на дефолт компонента).

### 4. Кнопка на всю ширину

```tsx
<Button type="submit" fullWidth>
    Sign Up
</Button>
```

### 5. Отключённая кнопка

```tsx
<Button disabled>Unavailable</Button>
```

### 6. Свой `className` вместе с SCSS Modules

```tsx
import { Button } from '@/shared/ui/button';

import css from './form.module.scss';

<Button className={css.extra} variant="secondary">
    Cancel
</Button>
```

Классы компонента и твой `className` объединяются: базовые стили Button сохраняются, локальный класс добавляет или переопределяет нужное.

### 7. Тип `ButtonVariant` в TypeScript

```tsx
import { Button, type ButtonVariant } from '@/shared/ui/button';

const actionVariant: ButtonVariant = 'outlined';

<Button variant={actionVariant}>Edit</Button>
```

## Состояния кнопки

Визуальные состояния уже описаны в `button.module.scss`. При использовании компонента отдельно прописывать hover/focus/disabled в своём SCSS не нужно.

| Состояние | Как работает |
|---|---|
| Default | Базовый вид выбранного `variant`. |
| Hover | Меняется фон, обводка или цвет текста (если кнопка не `disabled`). |
| Active | Вид в момент нажатия. |
| Focus | Стили через `:focus-visible` — обводка появляется при фокусе с клавиатуры. |
| Disabled | Кнопка неактивна: приглушённые цвета и `cursor: not-allowed`. |

Точные цвета зависят от `variant` (`primary`, `secondary`, `outlined`, `text`).

## Button или Link?

- `Button` — для действий: отправить форму, открыть модалку, переключить видимость пароля.
- `Link` из `next/link` — для перехода на другую страницу (`/sign-in`, `/sign-up` и т.д.).

Не заменяй обычную навигацию связкой `Button` + `router.push()`, если достаточно ссылки. Ссылка лучше для доступности, SEO и поведения браузера (открытие в новой вкладке, копирование URL).

## Использование в Next.js

Сам `Button` — обычный презентационный компонент. Его не обязательно помечать `'use client'`.

Если передаёшь интерактивный обработчик вроде `onClick`, то **компонент-родитель**, который создаёт этот обработчик, должен быть клиентским:

```tsx
'use client';

import { Button } from '@/shared/ui/button';

export const Example = (): React.JSX.Element => {
    return <Button onClick={() => alert('ok')}>OK</Button>;
};
```

Для `type="submit"` внутри клиентской формы с React Hook Form достаточно `'use client'` у формы; сам Button остаётся без директивы.

## Ограничения текущего API

Сейчас у компонента нет свойств вроде `loading`, `size`, `startIcon`, `endIcon`. Если они понадобятся — это отдельная доработка дизайн-системы, а не локальный хак в фиче.
