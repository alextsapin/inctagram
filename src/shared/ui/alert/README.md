# Alert

Компонент уведомления для отображения успешного результата или ошибки.

## Назначение

Alert показывает пользователю короткое сообщение. Уведомление может быть двух типов: success и error.

Компонент управляемый: родитель определяет, показывать ли уведомление, через open. При нажатии на крестик вызывается onClose, а родитель решает, как изменить состояние.

ЕСЛИ ОШИБКА ПОКАЗЫВАЕТСЯ ПРИ ОТКРЫТОМ ОКНЕ, ALERT НУЖНО КЛАСТЬ ВНУТРЬ MODAL. РЯДОМ С MODAL ОН ОКАЖЕТСЯ ПОД ЗАТЕМНЕНИЕМ, И КРЕСТИК НЕ НАЖМЁТСЯ.

## Импорт

```tsx
import { Alert } from '@/shared/ui/alert';
```

## Свойства (Props)

| Prop      | Тип                  | По умолчанию | Назначение                                                      |
| --------- | -------------------- | ------------ | --------------------------------------------------------------- |
| `open`    | `boolean`            | —            | Показывать уведомление (true) или скрыть (false).(обязательный) |
| `onClose` | `() => void`         | —            | Вызывается при нажатии на кнопку закрытия (обязательный)        |
| `type`    | 'success' \| 'error' | 'error'      | Тип уведомления                                                 |
| `message` | `string`             | —            | Текст уведомления.Обязательный                                  |

## Базовое использование

```tsx
import { useState } from 'react';
import { Alert } from '@/shared/ui/alert';

function App() {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsAlertOpen(true)}>
                Показать уведомление
            </button>

            <Alert
                open={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                message="The action could not be performed"
            />
        </>
    );
}
```

## Уведомление об успешном действии

```tsx
<Alert
    open={isAlertOpen}
    onClose={() => setIsAlertOpen(false)}
    type="success"
    message="Changes successfully saved"
/>
```

## Автоматическое закрытие

Alert не закрывается автоматически. Если это нужно, таймер следует реализовать в родительском компоненте:

```tsx
import { useState, useEffect } from 'react';
import { Alert } from '@/shared/ui/alert';

function App() {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {
        if (isAlertOpen) {
            const timer = setTimeout(() => setIsAlertOpen(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isAlertOpen]);

    return (
        <>
            <button type="button" onClick={() => setIsAlertOpen(true)}>
                Show notification
            </button>

            <Alert
                open={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                message="The action could not be performed"
            />
        </>
    );
}
```

## Доступность

Уведомление помечено role="alert", чтобы вспомогательные технологии могли сообщить о его появлении. Кнопка закрытия содержит изображение с альтернативным текстом Close.
