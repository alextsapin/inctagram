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

// Лента и профиль показывают каждый свой список
export const MOCK_FEED_POSTS: Post[] = FEED_POSTS;
export const MOCK_PROFILE_POSTS: Post[] = PROFILE_POSTS;

// Все посты вместе: по этому списку модалка, редактирование и лайки ищут пост по id
export const MOCK_POSTS: Post[] = [...FEED_POSTS, ...PROFILE_POSTS];

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
