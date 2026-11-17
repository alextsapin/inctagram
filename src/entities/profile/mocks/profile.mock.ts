import type { Profile } from '../model/types';

// Фикстуры профиля. Production-путь их не использует: profileApi ходит в
// реальный API. Оставлены для Storybook/тестов и локальной вёрстки без бэкенда.
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
// отличать чужой профиль от собственного.
export const MOCK_OTHER_PROFILE: Profile = {
    ...MOCK_PROFILE,
    uid: 'b7c8d9e0-1f2a-4b3c-9d4e-5f6a7b8c9d0e',
    avatar: '/profile/avatar-other-2.png',
    subscriptions: ['b7c8d9e0-1f2a-4b3c-9d4e-5f6a7b8c9d0e'],
};
