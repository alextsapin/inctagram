import type { CommentType } from '@/entities/comment'; // Убедись, что путь верный

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

import type { Post, User } from './type';

// ==========================================
// 1. ПОЛЬЗОВАТЕЛИ (База)
// ==========================================
export const MOCK_USERS: User[] = [
    { id: 'user-1', username: 'artem_dev', avatarUrl: el1.src, isFollowing: false },
    { id: 'user-2', username: 'ivan_ivanov', avatarUrl: el2.src, isFollowing: true },
    { id: 'user-3', username: 'anna_smith', avatarUrl: el3.src, isFollowing: false },
    { id: 'user-4', username: 'olga_k', avatarUrl: el1.src, isFollowing: true },
    { id: 'user-5', username: 'dmitry_ui', avatarUrl: el2.src, isFollowing: false },
    { id: 'user-6', username: 'elena_design', avatarUrl: el3.src, isFollowing: false },
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
export const MOCK_POSTS: Post[] = [
    {
        id: 'post-1',
        author: mockAuthor,
        // 3 картинки (тест карусели: стрелки + 3 точки)
        images: [
            { id: 'img-1', url: post1.src, alt: 'Пляж' },
            { id: 'img-2', url: post2.src, alt: 'Океан' },
            { id: 'img-3', url: post3.src, alt: 'Пальмы' },
        ],
        caption: 'Отпуск мечты 🌴☀️ Наконец-то добрался до океана!',
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
        caption: 'Тишина и горы. Лучший отдых 🏔️',
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
        caption: 'Утро начинается с кофе ☕🥐',
        likesCount: 0,
        commentsCount: 0, // Нет комментов (тест Empty State)
        isLiked: false,
        isSaved: false,
        likedBy: mockLikedByEmpty, // Нет лайков
        createdAt: '2023-10-18T08:00:00.000Z',
    },
];

// ==========================================
// 4. КОММЕНТАРИИ (Дерево)
// ==========================================
export const MOCK_COMMENTS: CommentType[] = [
    // --- Ветка 1 (Глубокая вложенность) ---
    {
        id: 'comment-1',
        postId: 'post-1',
        author: mockUser2,
        text: 'Это просто невероятно! Очень красивое место.',
        likesCount: 12,
        isLiked: false,
        createdAt: '2023-10-20T11:00:00.000Z',
        parentId: null, // Корневой
        replies: [
            {
                id: 'comment-2',
                postId: 'post-1',
                author: mockAuthor,
                text: '@ivan_ivanov Спасибо! Сам в восторге 😍',
                likesCount: 2,
                isLiked: true,
                createdAt: '2023-10-20T11:05:00.000Z',
                parentId: 'comment-1', // Ответ на comment-1
                replies: [
                    {
                        id: 'comment-3',
                        postId: 'post-1',
                        author: mockUser2,
                        text: 'А где именно отдыхал?',
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
        text: 'Хочу туда же! 😭',
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
        text: 'Какая красота! Горы всегда вдохновляют.',
        likesCount: 3,
        isLiked: false,
        createdAt: '2023-10-19T15:00:00.000Z',
        parentId: null,
        replies: [],
    },

    // Пост 3 (id: 'post-3') намеренно не имеет комментариев
];
