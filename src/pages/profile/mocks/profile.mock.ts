import type { Comment, Post, Profile } from '../model/types';

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
};

const COMMENT_TEXT =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua.';

export const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        username: 'UserName',
        avatarUrl: '/profile/avatar.png',
        text: COMMENT_TEXT,
        createdAt: '2 hours ago',
    },
    {
        id: 'c2',
        username: 'UserName',
        avatarUrl: '/profile/avatar.png',
        text: COMMENT_TEXT,
        createdAt: '2 Hours ago',
    },
    {
        id: 'c3',
        username: 'UserName',
        avatarUrl: '/profile/avatar.png',
        text: COMMENT_TEXT,
        createdAt: '2 Hours ago',
    },
    {
        id: 'c4',
        username: 'UserName',
        avatarUrl: '/profile/avatar.png',
        text: COMMENT_TEXT,
        createdAt: '2 Hours ago',
    },
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        images: ['/profile/post-1.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p2',
        images: ['/profile/post-2.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p3',
        images: ['/profile/post-3.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p4',
        images: ['/profile/post-4.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p5',
        images: ['/profile/post-5.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p6',
        images: ['/profile/post-6.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p7',
        images: ['/profile/post-7.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
    {
        id: 'p8',
        images: ['/profile/post-8.png'],
        likes: 2243,
        createdAt: 'July 3, 2021',
        comments: MOCK_COMMENTS,
    },
];
