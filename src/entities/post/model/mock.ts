/* eslint-disable no-magic-numbers */

// --- Импорты картинок для постов ---
import el1 from '../assets/Ellipse13.png';
import el2 from '../assets/Ellipse14.png';
import el3 from '../assets/Ellipse15.png';
import post1 from '../assets/post1.png';
import post2 from '../assets/post2.png';
import post3 from '../assets/post3.png';
import post4 from '../assets/post4.png';
import post5 from '../assets/post5.png';
import post6 from '../assets/post6.png';
// --- Импорты картинок для аватарок ---

import type { Post, User, UserPostsPage } from './type';

// ==========================================
// 1. ПОЛЬЗОВАТЕЛИ (База)
// ==========================================
// Совпадает с MOCK_ME при включённых моках авторизации.
// Храним автора независимо от MOCK_ME: гостевой сценарий меняет MOCK_ME на null.
export const MOCK_SIGNED_IN_AUTHOR: User = {
    id: '00000000-0000-0000-0000-000000000000',
    username: 'ivan_petrov',
    avatarUrl: el1.src,
    isFollowing: false,
};

export const MOCK_USERS: User[] = [
    { id: 'user-1', username: 'artem_dev', avatarUrl: el1.src, isFollowing: false },
    { id: 'user-2', username: 'ivan_ivanov', avatarUrl: el2.src, isFollowing: true },
    { id: 'user-3', username: 'anna_smith', avatarUrl: el3.src, isFollowing: false },
    { id: 'user-4', username: 'olga_k', avatarUrl: el1.src, isFollowing: true },
    { id: 'user-5', username: 'dmitry_ui', avatarUrl: el2.src, isFollowing: false },
    { id: 'user-6', username: 'elena_design', avatarUrl: el3.src, isFollowing: false },
    MOCK_SIGNED_IN_AUTHOR,
];

// Шорткаты для удобства
export const mockAuthor = MOCK_USERS[0];
export const mockUser2 = MOCK_USERS[1];
export const mockUser3 = MOCK_USERS[2];
export const mockUser4 = MOCK_USERS[3];

// ==========================================
// 2. СПИСКИ ЛАЙКНУВШИХ
// ==========================================
export const mockLikedByMany: User[] = MOCK_USERS.slice(0, 5); // 5 юзеров (тест AvatarStack)
export const mockLikedByFew: User[] = [MOCK_USERS[1], MOCK_USERS[2]]; // 2 юзера
export const mockLikedByEmpty: User[] = []; // 0 юзеров (тест пустого состояния)

// ==========================================
// 3. ПОСТЫ
// ==========================================
// Посты ленты
const FEED_POSTS: Post[] = [
    {
        id: 'post-1',
        author: mockAuthor,
        // 3 картинки (тест карусели: стрелки + 3 точки)
        images: [
            { id: 'img-1', url: post1.src, alt: 'Пляж' },
            { id: 'img-2', url: post2.src, alt: 'Океан' },
            { id: 'img-3', url: post3.src, alt: 'Пальмы' },
        ],
        caption: 'Dream vacation 🌴☀️ Finally made it to the ocean!',
        likesCount: 1243,
        commentsCount: 2,
        isLiked: false,
        isSaved: true,
        likedBy: mockLikedByMany, // Много лайков
        createdAt: '2023-10-20T10:30:00.000Z', // Статичная дата (SSR safe)
    },
    {
        id: 'post-2',
        author: mockUser2,
        // 1 картинка (тест карусели: без стрелок и точек)
        images: [{ id: 'img-4', url: post4.src, alt: 'Горы' }],
        caption: 'Silence and mountains. The best kind of getaway 🏔️',
        likesCount: 2,
        commentsCount: 1,
        isLiked: true,
        isSaved: false,
        likedBy: mockLikedByFew, // Мало лайков
        createdAt: '2023-10-19T14:15:00.000Z',
    },
    {
        id: 'post-3',
        author: mockUser3,
        // 2 картинки
        images: [
            { id: 'img-5', url: post5.src, alt: 'Кофе' },
            { id: 'img-6', url: post6.src, alt: 'Круассан' },
        ],
        caption: 'The morning begins with coffee ☕🥐',
        likesCount: 0,
        commentsCount: 0, // Нет комментов (тест Empty State)
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByEmpty, // Нет лайков
        createdAt: '2023-10-18T08:00:00.000Z',
    },
];

// Посты профиля: картинки public/profile/post-1...8 в том порядке,
// в каком они были в сетке профиля
const PROFILE_POSTS: Post[] = [
    {
        id: 'profile-post-1',
        author: mockAuthor,
        images: [
            {
                id: 'profile-img-1',
                url: '/profile/post-1.png',
                alt: 'Man in a red beanie',
            },
        ],
        caption: 'New profile photo 🧢',
        likesCount: 98,
        commentsCount: 0,
        isLiked: true,
        isSaved: false,
        likedBy: mockLikedByMany,
        createdAt: '2023-10-17T09:00:00.000Z',
    },
    {
        id: 'profile-post-2',
        author: mockUser4,
        images: [
            {
                id: 'profile-img-2',
                url: '/profile/post-2.png',
                alt: 'Hiking in the mountains',
            },
        ],
        caption: 'Fresh air and a great view 🏞️',
        likesCount: 87,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByFew,
        createdAt: '2023-10-16T12:00:00.000Z',
    },
    {
        id: 'profile-post-3',
        author: mockAuthor,
        images: [
            {
                id: 'profile-img-3',
                url: '/profile/post-3.png',
                alt: 'Team at the office',
            },
        ],
        caption: 'First day at the new office 💼',
        likesCount: 152,
        commentsCount: 0,
        isLiked: true,
        isSaved: false,
        likedBy: mockLikedByMany,
        createdAt: '2023-10-15T16:30:00.000Z',
    },
    {
        id: 'profile-post-4',
        author: mockUser3,
        images: [
            {
                id: 'profile-img-4',
                url: '/profile/post-4.png',
                alt: 'Coffee and photos on the table',
            },
        ],
        caption: 'Coffee and memories ☕',
        likesCount: 45,
        commentsCount: 0,
        isLiked: false,
        isSaved: true,
        likedBy: mockLikedByFew,
        createdAt: '2023-10-14T08:20:00.000Z',
    },
    {
        id: 'profile-post-5',
        author: mockUser2,
        images: [
            { id: 'profile-img-5', url: '/profile/post-5.png', alt: 'Team meeting' },
        ],
        caption: 'Brainstorming with the team 💡',
        likesCount: 34,
        commentsCount: 0,
        isLiked: false,
        isSaved: true,
        likedBy: mockLikedByFew,
        createdAt: '2023-10-13T11:10:00.000Z',
    },
    {
        id: 'profile-post-6',
        author: mockUser4,
        images: [
            { id: 'profile-img-6', url: '/profile/post-6.png', alt: 'Healthy breakfast' },
        ],
        caption: 'Healthy breakfast to start the day 🍓',
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByEmpty,
        createdAt: '2023-10-12T07:45:00.000Z',
    },
    {
        id: 'profile-post-7',
        author: mockUser3,
        images: [
            {
                id: 'profile-img-7',
                url: '/profile/post-7.png',
                alt: 'Photographer with a camera',
            },
        ],
        caption: 'Behind the lens 📷',
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByEmpty,
        createdAt: '2023-10-11T18:45:00.000Z',
    },
    {
        id: 'profile-post-8',
        author: mockAuthor,
        images: [
            {
                id: 'profile-img-8',
                url: '/profile/post-8.png',
                alt: 'Travel map and photos',
            },
        ],
        caption: 'Planning the next trip 🗺️',
        likesCount: 61,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByMany,
        createdAt: '2023-10-10T10:15:00.000Z',
    },
];

// Дополнительные посты одного автора для проверки подгрузки по 8 элементов.
// Даты фиксированные, чтобы мок оставался детерминированным при SSR.
const EXTRA_PROFILE_POSTS: Post[] = Array.from({ length: 17 }, (_, index): Post => {
    const imageNumber = (index % 8) + 1;
    const postNumber = String(index + 1).padStart(2, '0');

    return {
        id: `mock-own-post-${postNumber}`,
        author: MOCK_SIGNED_IN_AUTHOR,
        images: [
            {
                id: `mock-own-image-${postNumber}`,
                url: `/profile/post-${imageNumber}.png`,
                alt: `Profile photo ${imageNumber}`,
            },
        ],
        caption:
            index === 0
                ? 'A long caption for testing Show more. '.repeat(12).trim()
                : `My publication ${index + 1}. Testing profile pagination and posts.`,
        likesCount: index * 3,
        commentsCount: index % 4,
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByEmpty,
        createdAt: new Date(Date.UTC(2026, 10, 6, 12 - index)).toISOString(),
    };
});

// Значение счётчика главной — отдельный мок, а не длина короткого списка MOCK_USERS.
export const MOCK_REGISTERED_USERS_COUNT = 9213;

// Существующие экспорты сохраняем: старые экраны продолжат работать.
export const MOCK_FEED_POSTS: Post[] = FEED_POSTS;
export const MOCK_PROFILE_POSTS: Post[] = PROFILE_POSTS;

// Единый изменяемый список для будущего API постов (задача №1).
const newestFirst = (first: Post, second: Post): number =>
    Date.parse(second.createdAt) - Date.parse(first.createdAt);

export const MOCK_POSTS: Post[] = [
    ...EXTRA_PROFILE_POSTS,
    ...FEED_POSTS,
    ...PROFILE_POSTS,
].sort(newestFirst);

export const getMockPost = (id: string): Post | undefined =>
    MOCK_POSTS.find(post => post.id === id);

export const getMockUserPosts = (username: string): Post[] =>
    MOCK_POSTS.filter(post => post.author.username === username).sort(newestFirst);

// Страница постов пользователя для бесконечной загрузки (задача 12 / BLD-142).
// cursor — id последнего поста предыдущей страницы (null на первой странице).
// nextCursor — id последнего поста страницы, либо null, если постов больше нет.
export const getMockUserPostsPage = async (
    username: string,
    cursor: string | null,
    limit: number,
): Promise<UserPostsPage> => {
    const posts = getMockUserPosts(username);

    const startIndex =
        cursor === null ? 0 : posts.findIndex(post => post.id === cursor) + 1;

    if (startIndex === 0 && cursor !== null) {
        // Курсор указывает на пост, которого больше нет (удалён): страница не может быть
        // построена от него. Бросаем ошибку, чтобы UI показал Retry, а не молча объявлял
        // список законченным.
        throw new Error('Stale cursor');
    }

    const page = posts.slice(startIndex, startIndex + limit);
    const nextCursor =
        startIndex + limit < posts.length ? page[page.length - 1]?.id ?? null : null;

    return { posts: page, nextCursor };
};

export const getMockLatestPosts = (limit = 4): Post[] =>
    [...MOCK_POSTS].sort(newestFirst).slice(0, limit);

// Эти операции работают с памятью, не с БД. После полной перезагрузки
// клиентского приложения исходные данные моков восстановятся.
export const createMockPost = (post: Post): Post => {
    if (getMockPost(post.id)) {
        throw new Error(`Mock post with id ${post.id} already exists`);
    }

    MOCK_POSTS.unshift(post);
    MOCK_PROFILE_POSTS.unshift(post);
    MOCK_FEED_POSTS.unshift(post);

    return post;
};

export const updateMockPost = (id: string, caption: string): Post | undefined => {
    const post = getMockPost(id);

    if (post) {
        post.caption = caption;
    }

    return post;
};

export const deleteMockPost = (id: string): boolean => {
    const index = MOCK_POSTS.findIndex(post => post.id === id);

    if (index === -1) {
        return false;
    }

    MOCK_POSTS.splice(index, 1);

    [MOCK_FEED_POSTS, MOCK_PROFILE_POSTS].forEach(list => {
        const listIndex = list.findIndex(post => post.id === id);

        if (listIndex !== -1) {
            list.splice(listIndex, 1);
        }
    });

    return true;
};

// ==========================================
// 4. КОММЕНТАРИИ (Дерево)
// ==========================================
export const MOCK_COMMENTS = [
    // --- Ветка 1 (Глубокая вложенность) ---
    {
        id: 'comment-1',
        postId: 'post-1',
        author: mockUser2,
        text: 'This is simply incredible! A very beautiful place.',
        likesCount: 12,
        isLiked: false,
        createdAt: '2023-10-20T11:00:00.000Z',
        parentId: null, // Корневой
        replies: [
            {
                id: 'comment-2',
                postId: 'post-1',
                author: mockAuthor,
                text: '@ivan_ivanov Thanks! I’m thrilled with it myself. 😍',
                likesCount: 2,
                isLiked: true,
                createdAt: '2023-10-20T11:05:00.000Z',
                parentId: 'comment-1', // Ответ на comment-1
                replies: [
                    {
                        id: 'comment-3',
                        postId: 'post-1',
                        author: mockUser2,
                        text: 'And where exactly did you vacation?',
                        likesCount: 0,
                        isLiked: false,
                        createdAt: '2023-10-20T11:10:00.000Z',
                        parentId: 'comment-2', // Ответ на comment-2
                        replies: [], // Дальше глубина не идет
                    },
                ],
            },
        ],
    },

    // --- Ветка 2 (Простой коммент без ответов) ---
    {
        id: 'comment-4',
        postId: 'post-1',
        author: mockUser4,
        text: 'I want to go there too!! 😭',
        likesCount: 5,
        isLiked: false,
        createdAt: '2023-10-20T12:30:00.000Z',
        parentId: null,
        replies: [],
    },

    // --- Ветка 3 (Комментарий к другому посту) ---
    {
        id: 'comment-5',
        postId: 'post-2',
        author: mockUser3,
        text: 'How beautiful! Mountains are always inspiring.',
        likesCount: 3,
        isLiked: false,
        createdAt: '2023-10-19T15:00:00.000Z',
        parentId: null,
        replies: [],
    },

    // Пост 3 (id: 'post-3') намеренно не имеет комментариев
];
