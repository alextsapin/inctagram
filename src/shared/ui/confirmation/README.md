# Confirmation

Компонент модального окна для запроса подтверждения действия.

## Назначение

`Confirmation` показывает заголовок, сообщение и две кнопки: **Yes** и **No**. Используйте его, когда перед выполнением действия нужно получить подтверждение пользователя, например перед удалением данных.

Компонент построен на `Modal` и управляется родителем: родитель передаёт `open` и определяет, что делать при подтверждении или закрытии окна.

## Импорт

```tsx
import { Confirmation } from '@/shared/ui/confirmation';
```

## Свойства (Props)

| Prop           | Тип                  | По умолчанию | Назначение                                            |
| -------------- | -------------------- | ------------ | ----------------------------------------------------- |
| `open`         | `boolean`            | —            | Показывать окно или скрыть его (обязательный)         |
| `title`        | `string`             | —            | Заголовок окна (обязательный)                         |
| `text`         | `React.ReactNode`    | —            | Сообщение внутри окна (обязательный)                  |
| `confirmText`  | `string`             | —            | Текст кнопки подтверждения (необязательный)           |
| `cancelText`   | `string`             | —            | Текст кнопки отмены (необязательный)                  |
| `onCancel`     | `() => void`         | —            | Обработчик нажатия на кнопку отмены (необязательный)  |
| `width`        | `number`             | `378`        | Ширина окна в пикселях                                |
| `actionsAlign` | `'end' \| 'between'` | `'end'`      | Выравнивание кнопок                                   |
| `disabled`     | `boolean`            | `false`      | Обе кнопки неактивны, пока действие выполняется       |
| `onConfirm`    | `() => void`         | —            | Обработчик нажатия на Yes (обязательный)              |
| `onClose`      | `() => void`         | —            | Обработчик закрытия и нажатия крестика (обязательный) |

## Пример использования

`Confirmation` — управляемый компонент. Родитель хранит состояние открытия окна и передаёт обработчики подтверждения и отмены.

```tsx
'use client';

import { useState } from 'react';
import { Confirmation } from '@/shared/ui/confirmation';

export const DeletePost = (): React.JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onConfirm = (): void => {
        console.log('Confirmed');
        // Здесь можно выполнить удаление поста.
        setIsModalOpen(false);
    };

    const onClose = (): void => {
        // Отмена действия
        console.log('cancellation');
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Кнопка для открытия модального окна */}
            <button type="button" onClick={() => setIsModalOpen(true)}>
                Удалить пост
            </button>
            <Confirmation
                open={isModalOpen}
                title="Delete post"
                text="Are you sure you want to delete this post?"
                confirmText="Yes"
                cancelText="No"
                width={438}
                actionsAlign="end"
                onConfirm={onConfirm}
                onCancel={onClose}
                onClose={onClose}
            />
        </>
    );
};
```

Confirmation нужен непустой заголовок (title). Если он не передается: не отображаются шапка и крестик, не отображаются кнопки Yes и No, не будет доступного названия через aria-labelledby.

Confirmation не закрывает окно автоматически при нажатии на Yes. Если окно нужно закрыть после подтверждения, это следует сделать в onConfirm, как в примере. Нажатие на No вызывает onCancel.

`disabled` делает неактивными только две кнопки. Крестик, Esc и клик по фону по-прежнему вызывают onClose. Если окно нельзя закрывать, пока действие выполняется, родитель должен сам не закрывать его в onClose:

```tsx
const handleClose = (): void => {
    if (!isSaving) setIsModalOpen(false);
};
```
