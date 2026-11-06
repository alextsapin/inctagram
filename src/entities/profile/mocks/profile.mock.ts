import type { Profile } from '../model/types';

export const MOCK_PROFILE: Profile = {
    username: 'UserName',
    aboutMe:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
        'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
        'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    avatarUrl: '/profile/avatar.png',
    stats: {
        following: 2218,
        followers: 2358,
        publications: 2764,
    },
    isVerified: false,
};

// Профиль другого пользователя с отличным аватаром, чтобы визуально
// отличать чужой профиль от собственного.
export const MOCK_OTHER_PROFILE: Profile = {
    ...MOCK_PROFILE,
    avatarUrl: '/profile/avatar-other-2.png',
};
