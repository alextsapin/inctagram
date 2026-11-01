// ==========================================
// 4. КОММЕНТАРИИ (Дерево)

import { CommentType } from './type';

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
