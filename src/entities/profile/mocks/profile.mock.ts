import type { Profile } from '../model/types';

// Имена пользователей, у которых «профиль существует». Нужны, чтобы отличать
// случай «такого username нет вообще» (профиль не найден) от «профиль есть,
// но постов нет» (например dmitry_ui). Пока нет бэкенда, список задан вручную.
const MOCK_PROFILE_USERNAMES = new Set<string>([
    'ivan_petrov', // собственный аккаунт (совпадает с MOCK_ME)
    'artem_dev',
    'ivan_ivanov',
    'anna_smith',
    'olga_k',
    'dmitry_ui', // профиль существует, но постов нет
    'elena_design',
]);

// Проверка: существует ли профиль с таким username.
export const isKnownUsername = (username: string): boolean =>
    MOCK_PROFILE_USERNAMES.has(username);

// uid мок-профилей. Нужен, чтобы subscriptions содержал uid самого пользователя —
// ровно так ведёт себя заглушка реального бэкенда.
export const MOCK_PROFILE_UIDS: Record<string, string> = {
    ivan_petrov: '3f1c2a10-5b7e-4c8d-9a21-6d4e8f0b1c23',
    artem_dev: '7a2d4b31-8c6f-4e19-b3d5-1f9a2c7e4b60',
    ivan_ivanov: 'b5e8c742-1d3a-4f60-8c27-9e4b1a6d3f85',
    anna_smith: 'c9d1e853-2f4b-4a71-9d38-0a5c2b7e4f96',
    olga_k: 'd2f3a964-3a5c-4b82-ae49-1b6d3c8f5a07',
    dmitry_ui: 'e6a4b075-4b6d-4c93-bf5a-2c7e4d9a6b18',
    elena_design: 'f1b5c286-5c7e-4da4-c06b-3d8f5e0b7c29',
};

export const MOCK_PROFILE: Profile = {
    uid: 'a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    username: 'UserName',
    avatar: '/profile/avatar.png',
    // Заглушка бэкенда: подписки содержат только самого пользователя.
    subscriptions: ['a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d'],
    // Заглушка бэкенда: всегда 1 (сам пользователь).
    followers: 1,
    // Совпадает с числом постов в MOCK_PROFILE_POSTS (entities/post/model/mock.ts).
    publications: 8,
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
        'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
        'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};

// Профиль другого пользователя с отличным аватаром, чтобы визуально
// отличать чужой профиль от собственного. uid/username/subscriptions
// подставляются в profileApi по запрошенному username.
export const MOCK_OTHER_PROFILE: Profile = {
    ...MOCK_PROFILE,
    uid: 'b7c8d9e0-1f2a-4b3c-9d4e-5f6a7b8c9d0e',
    avatar: '/profile/avatar-other-2.png',
    subscriptions: ['b7c8d9e0-1f2a-4b3c-9d4e-5f6a7b8c9d0e'],
};
