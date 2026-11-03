
Alert
Компонент уведомления для отображения успешного результата или ошибки.

Назначение
Alert показывает пользователю короткое сообщение. Уведомление может быть двух типов: success и error.

Компонент управляемый: родитель определяет, показывать ли уведомление, через open. При нажатии на крестик вызывается onClose, а родитель решает, как изменить состояние.

Импорт

import { Alert } from './Alert/alert';


| Prop                  | Тип                  | По умолчанию | Назначение                                                 |
| --------------------- | -------------------- | ------------ | ---------------------------------------------------------- |
| `open`                | `boolean`            | —            | Показывать уведомление (true) или скрыть (false).(обязательный)                             |
| `onClose`             | `() => void`         | —            | Вызывается при нажатии на кнопку закрытия (обязательный)   |
| `type`                | 'success' | 'error'  | 'error'      | Тип уведомления                                            |
| `message`             | `string`             | —            | Текст уведомления.Обязательный                             |


`headerLeft`, `headerRight`, `noPadding`, `actions` и `actionsAlign` работают только вместе с `title`: это части шапки и тела стандартного окна.

Окно управляемое (controlled): открыто оно или нет, хранит родитель в `useState`. `Modal` сам себя не закрывает, он только вызывает `onClose`. Родитель решает, что делать: закрыть окно, показать подтверждение «Точно закрыть?» или ничего не делать.

Базовое использование

import { useState } from 'react';
import { Alert } from './Alert/alert';

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
        message="Не удалось выполнить действие"
      />
    </>
  );
}

Уведомление об успешном действии

<Alert
  open={isAlertOpen}
  onClose={() => setIsAlertOpen(false)}
  type="success"
  message="Изменения успешно сохранены"
/>


Автоматическое закрытие
Alert не закрывается автоматически. Если это нужно, таймер следует реализовать в родительском компоненте:

```jsx
import { useState, useEffect } from 'react';
import { Alert } from './Alert/alert';

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
        Показать уведомление
      </button>

      <Alert
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message="Не удалось выполнить действие"
      />
    </>
  );
}


Доступность
Уведомление помечено role="alert", чтобы вспомогательные технологии могли сообщить о его появлении. Кнопка закрытия содержит изображение с альтернативным текстом Close.