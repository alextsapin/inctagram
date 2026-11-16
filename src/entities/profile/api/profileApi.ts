import {
    isKnownUsername,
    MOCK_OTHER_PROFILE,
    MOCK_PROFILE_UIDS,
} from '../mocks/profile.mock';
import type { Profile } from '../model/types';

// Заглушки API. На бэкенде пока нет эндпоинтов профиля, поэтому методы
// возвращают mock-данные (async), но подключены через TanStack Query.
// Вход и данные текущего пользователя (getMe) при этом настоящие.
// Когда появятся реальные endpoints, замени тела функций на запросы к API.
// Сейчас методы async, но с моками: архитектурный переход с синхронного
// вызова на асинхронный запрос с query-состояниями (BLD-143).

// Профиль не найден: username неизвестен. UI должен показать целое состояние
// «такого профиля нет», а не шапку с ошибкой и сетку постов рядом.
export class ProfileNotFoundError extends Error {
    constructor(username: string) {
        super(`Profile with username ${username} not found`);
        this.name = 'ProfileNotFoundError';
    }
}

export const profileApi = {
    // TODO: заменить на GET /api/v1/{username}/profile
    // username берём из адреса, чтобы на странице было настоящее имя.
    // Если username не существует — бросаем ProfileNotFoundError, чтобы
    // отличить «профиль есть, но постов нет» от «такого username нет вообще».
    //
    // ВАЖНО: проверка через isKnownUsername — временное решение, специфичное
    // для моков. На реальном бэкенде ProfileNotFoundError должен бросаться по
    // HTTP-статусу 404 ответа, а не по значению isKnownUsername: реальный 404
    // приходит без JSON-тела (в спеке у него нет content/schema), поэтому
    // распознать «профиля нет» можно только по статусу.
    async getUserProfile(username: string): Promise<Profile> {
        if (!isKnownUsername(username)) {
            return Promise.reject(new ProfileNotFoundError(username));
        }

        // uid и subscriptions мок-профиля привязаны к запрошенному username:
        // заглушка бэкенда возвращает в subscriptions только самого пользователя.
        const uid = MOCK_PROFILE_UIDS[username] ?? MOCK_OTHER_PROFILE.uid;

        return Promise.resolve({
            ...MOCK_OTHER_PROFILE,
            uid,
            username,
            subscriptions: [uid],
        });
    },
};
