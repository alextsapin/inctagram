# API: запросы к бэкенду

Общая инфраструктура для запросов к бэкенду лежит в `src/shared/api/`. Её
используют все слайсы, которым нужен сервер. Контракт с бэкендом — Swagger.

## Файлы

```text
src/shared/api/
├── instance.ts      # axios instance — через него идут все запросы
├── accessToken.ts   # access token в памяти
├── queryClient.ts   # настройки TanStack Query (см. tanstack-query.md)
└── index.ts         # публичный API: импортируем только через '@/shared/api'
```

Всё лежит в `shared`, потому что ни один из этих файлов не знает о конкретных
фичах или сущностях — это инфраструктура. Импортировать из `shared` можно из
любого слоя FSD.

## axios instance (instance.ts)

Один настроенный экземпляр axios для всех запросов к бэкенду.

-   **Зачем.** Без него каждый запрос повторял бы одни и те же настройки: адрес
    бэкенда, отправку cookie, заголовок с токеном. Теперь они заданы в одном
    месте, а запрос пишется в одну строку.
-   **Почему axios.** Команда работала с ним на обучении. Кроме того, axios сам
    выбрасывает ошибку на ответах 4xx/5xx, сам превращает тело запроса в JSON и
    кладёт ответ в `response.data`.

Настройки:

-   `baseURL` — из переменной `NEXT_PUBLIC_API_URL` (см. ниже). Если она пустая,
    запросы идут через прокси Next.js на том же origin (`/api/v1/...`).
-   `withCredentials: true` — без этого браузер не сохранит и не отправит
    cookie с refresh-токеном.
-   Request interceptor — перед каждым запросом добавляет заголовок
    `Authorization: Bearer <token>`, если токен есть. Поэтому в самих запросах
    токен вручную не передаём.

Заголовок добавляется через `config.headers.set(...)`, а не присваиванием
`config.headers.Authorization = ...`: правило ESLint `no-param-reassign`
запрещает менять свойства параметра функции.

## Как добавить запрос

Функция запроса лежит в сегменте `api` того слайса, которому она нужна
(сущности или фичи), и использует `instance`:

```ts
// src/entities/session/api/api.ts
import { instance } from '@/shared/api';

import type { Me } from '../model/types';

export const getMe = async (): Promise<Me> => {
    const response = await instance.get<Me>('/api/v1/auth/me');

    return response.data;
};
```

-   Путь пишем полностью, начиная с `/api/v1/...`, как в Swagger. Префикс `v1`
    обязателен: так требует площадка, на которой развёрнут бэкенд. Старые адреса
    `/api/...` без `v1` отвечают 404.
-   Тип ответа передаём в `instance.get<Тип>()` / `instance.post<Тип>()` и
    описываем в `model/types.ts` слайса по схеме из Swagger.
-   Возвращаем `response.data`, а не весь ответ axios.
-   Вызываем функцию из `useQuery` / `useMutation` — см.
    [TanStack Query](tanstack-query.md).

## Ошибки

-   Если сервер ответил кодом 4xx/5xx, axios выбрасывает ошибку. Код ответа
    лежит в `error.response.status`.
-   Если сервер не ответил совсем (нет сети, сервер недоступен), у ошибки нет
    `response`.
-   Проверить, что ошибка пришла от axios, можно функцией `isAxiosError` из
    `axios`.

Текст для пользователя выбираем по коду ответа в слайсе, которому он нужен, —
пример: `src/features/sign-in/model/getSignInErrorText.ts`. Текст из ответа
сервера на экран не выводим: тела ошибок в Swagger не описаны, а тексты для
пользователя берём из Figma и ТЗ.

## Access token (accessToken.ts)

`getAccessToken` / `setAccessToken` — хранят access token в обычной переменной
модуля.

-   **Почему в памяти, а не в `localStorage`.** Из `localStorage` токен может
    прочитать любой скрипт на странице — например, внедрённый через уязвимую
    библиотеку. Из переменной модуля его так просто не достать.
-   **Почему это допустимо.** Access token живёт 15 минут, а долгоживущий
    refresh-токен бэкенд хранит в httpOnly-cookie, которую JavaScript не видит
    вовсе. Новый access token выдаёт `POST /api/v1/auth/refresh`.
-   **Почему рядом с instance.** Токен читает interceptor из `instance.ts`, а
    `shared` не может импортировать из слоёв выше.

Токен сохраняется после входа (`features/sign-in`, см.
[Вход в систему](sign-in.md)).

**Ограничение:** после перезагрузки страницы токен пропадает, и нужно войти
заново. Восстановление сессии через `POST /api/v1/auth/refresh` и обновление
токена по истечении 15 минут — отдельные задачи.

## Переменные окружения

| Переменная            | Назначение                                           | Значение в production               |
| --------------------- | ---------------------------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Запросы браузера и ссылки Google/GitHub OAuth         | `https://api.blackdragonmedia.info` |
| `SERVER_API_URL`      | Серверные запросы Next.js, ISR и прокси `/api/v1/...` | `https://api.blackdragonmedia.info` |

-   Указывай origin без `/api/v1` и завершающего слеша. Например, вход в
    production обращается к `https://api.blackdragonmedia.info/api/v1/auth/login`.
-   Для локального запуска скопируй `.env.example` в `.env.local` и задай
    `SERVER_API_URL` для своего бэкенда. При пустом `NEXT_PUBLIC_API_URL`
    запросы идут через прокси Next.js. Для прямых запросов из браузера задай
    также `NEXT_PUBLIC_API_URL` и разреши на бэкенде CORS для локального origin,
    например `http://localhost:3000`. После изменения `.env.local` перезапусти `pnpm dev`.
-   Docker и Jenkins передают обе переменные на этапе `next build`.
    `NEXT_PUBLIC_API_URL` встраивается в клиентский JS. `SERVER_API_URL` также
    передаётся при запуске standalone-сервера, в том числе через манифест Kubernetes.
