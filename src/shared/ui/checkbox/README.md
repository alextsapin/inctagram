# Checkbox

Универсальный чекбокс для интерфейса Inctagram.

## Назначение

`Checkbox` — общий UI-компонент для выбора да/нет: согласие с условиями, опции в настройках, флаги в формах.

Компонент лежит в слое `shared` архитектуры FSD, потому что это переиспользуемый элемент без привязки к конкретной фиче (Sign In, Sign Up и т.д.). Его можно импортировать из любого слоя выше: `features`, `widgets`, `pages`.

Используй `Checkbox`, когда нужен нативный `<input type="checkbox">` с единым оформлением проекта. Не создавай локальные копии чекбокса в фичах — бери этот компонент.

Сам компонент отвечает только за элемент управления. Текстовую подпись, ссылки и сообщения об ошибках размещай снаружи — в форме или другом родительском компоненте.

## Импорт

```tsx
import { Checkbox } from '@/shared/ui/checkbox';
```

Импортируй только через публичный API слайса (`index.ts`). Не пиши пути вида `@/shared/ui/checkbox/ui/Checkbox`: внутреннее устройство папки может измениться, а публичный экспорт останется стабильным.

## Свойства (Props)

Тип пропсов основан на `React.ComponentPropsWithRef<'input'>`, но свойство `type` зафиксировано внутри компонента как `"checkbox"` и снаружи недоступно.

| Prop             | Тип                     | По умолчанию | Назначение                                  |
| ---------------- | ----------------------- | ------------ | ------------------------------------------- |
| `checked`        | `boolean`               | —            | Controlled-состояние (отмечен / не отмечен) |
| `defaultChecked` | `boolean`               | —            | Начальное состояние для uncontrolled-режима |
| `onChange`       | Обработчик React        | —            | Реакция на изменение                        |
| `onBlur`         | Обработчик React        | —            | Реакция на потерю фокуса                    |
| `name`           | `string`                | —            | Имя поля формы                              |
| `disabled`       | `boolean`               | `false`      | Отключение чекбокса                         |
| `id`             | `string`                | —            | Связь с `<label htmlFor>`                   |
| `className`      | `string`                | —            | Дополнительные CSS-классы                   |
| `ref`            | `Ref<HTMLInputElement>` | —            | Доступ к нативному input                    |
| `aria-*`         | стандартные ARIA        | —            | Доступность для скринридеров                |

Также поддерживаются остальные стандартные HTML-атрибуты `<input>` (кроме `type`), потому что пропсы расширяют `React.ComponentPropsWithRef<'input'>`.

## Controlled и uncontrolled

### Uncontrolled — `defaultChecked`

Браузер сам хранит состояние. Подходит для простых случаев без синхронизации с React-состоянием.

```tsx
<Checkbox id="remember" defaultChecked />
```

### Controlled — `checked` + `onChange`

Состояние хранится снаружи (в `useState`, сторе и т.д.). Значение всегда задаётся пропом `checked`.

```tsx
const [isChecked, setIsChecked] = useState(false);

<Checkbox
    id="newsletter"
    checked={isChecked}
    onChange={event => setIsChecked(event.target.checked)}
/>;
```

Не смешивай в одном экземпляре одновременно полноценный controlled-режим (`checked`) и `defaultChecked`: выбери один подход.

## Как работают `checked` и `defaultChecked`

-   `checked` — текущее значение «под контролем» родителя. Меняется только если родитель обновил проп (обычно в `onChange`).
-   `defaultChecked` — только стартовое значение. Дальше пользователь и браузер переключают чекбокс сами.

Для чтения значения без controlled-режима можно использовать `ref` или работу через форму (`FormData`, React Hook Form).

## Как использовать `onChange`

```tsx
<Checkbox
    onChange={event => {
        console.log(event.target.checked);
    }}
/>
```

`event.target.checked` — это `boolean`: `true`, если чекбокс отмечен, и `false`, если снят.

## React Hook Form через `register`

В универсальный `Checkbox` не встраивается React Hook Form. Подключай его снаружи через `{...register('fieldName')}` — так же, как для обычного input.

```tsx
'use client';

import { useForm } from 'react-hook-form';

import { Checkbox } from '@/shared/ui/checkbox';

type FormValues = {
    termsAccepted: boolean;
};

export const ExampleForm = (): React.JSX.Element => {
    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            termsAccepted: false,
        },
    });

    return (
        <form onSubmit={handleSubmit(console.log)}>
            <Checkbox
                id="termsAccepted"
                {...register('termsAccepted', {
                    required: 'You must agree to the terms',
                })}
            />
            <button type="submit">Submit</button>
        </form>
    );
};
```

`register` передаёт в input `name`, `onChange`, `onBlur` и `ref`. Компонент прокидывает их в нативный `<input type="checkbox">`, поэтому валидация и `handleSubmit` работают как обычно.

## Связь с `<label>` и `id`

Чтобы клик по тексту переключал чекбокс, свяжи подпись через `htmlFor` и `id`:

```tsx
<label htmlFor="termsAccepted">
    <Checkbox id="termsAccepted" />
    Remember me
</label>
```

Если рядом с чекбоксом есть ссылки (`next/link` или `<a>`), не клади их внутрь `<label>`. Иначе клик по ссылке может затронуть переключение чекбокса. Свяжи с контролом текстовую подпись через `htmlFor` / `id`, а ссылки оставь соседними элементами:

```tsx
<div>
    <label htmlFor="termsAccepted">
        <Checkbox id="termsAccepted" />I agree to the{' '}
    </label>
    <Link href="/terms-of-service">Terms of Service</Link>
    <span> and </span>
    <Link href="/privacy-policy">Privacy Policy</Link>
</div>
```

Для скринридеров без видимого текста можно передать `aria-label`:

```tsx
<Checkbox aria-label="Accept terms" />
```

## Состояния

Визуальные состояния описаны в `checkbox.module.scss`. Отдельно прописывать hover/focus/disabled в своём SCSS не нужно.

| Состояние | Как работает                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Default   | Unchecked — квадрат 16×16 с белой рамкой. Checked — белый квадрат с тёмной галочкой.                              |
| Hover     | Круглая подложка `#333` (если не `disabled`).                                                                     |
| Active    | Круглая подложка `#4C4C4C` в момент нажатия.                                                                      |
| Focus     | Круглая подложка `#171717` и белое кольцо `box-shadow` через `:focus-visible` — заметно на `#0d0d0d` и `#171717`. |
| Disabled  | Приглушённые серые цвета (`#4C4C4C`), `cursor: not-allowed`, без hover/active.                                    |

Переключение мышью и клавишей Space, а также фокус по Tab сохраняются за счёт нативного `<input type="checkbox">`.

## `disabled`, `className`, `aria-label`

```tsx
<Checkbox disabled />

<Checkbox disabled defaultChecked />

<Checkbox className={css.extra} id="extra" />

<Checkbox aria-label="Enable notifications" />
```

Классы компонента и твой `className` объединяются: базовые стили Checkbox сохраняются, локальный класс добавляет или переопределяет нужное.

## Почему нет логики конкретной формы

`Checkbox` в `shared` не должен знать про Sign Up, тексты согласия, ссылки на Terms/Privacy или тексты ошибок валидации.

-   Универсальный компонент = только контрол и его внешний вид.
-   Подпись, ссылки, ошибки, `register`, `defaultValues` — ответственность фичи (`features/sign-up` и т.п.).

Так компонент остаётся переиспользуемым: тот же Checkbox можно поставить в настройки, модалку или другую форму без копирования кода.

## Использование в Next.js

Сам `Checkbox` — обычный презентационный компонент. Его не обязательно помечать `'use client'`.

Если родитель передаёт обработчики вроде `onChange` или использует React Hook Form, `'use client'` нужен у **родителя** (например у формы), а не у самого Checkbox.

## Ограничения текущего API

Сейчас у компонента нет встроенной подписи (`label`), текста ошибки или размеров (`size`). Если они понадобятся — это отдельная доработка дизайн-системы, а не локальный хак в фиче.
