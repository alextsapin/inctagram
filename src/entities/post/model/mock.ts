/* eslint-disable no-magic-numbers */

import avatar1 from '../assets/Ellipse13.png';
import avatar2 from '../assets/Ellipse14.png';
import avatar3 from '../assets/Ellipse15.png';
import post1 from '../assets/post1.png';
import post2 from '../assets/post2.png';
import post3 from '../assets/post3.png';
import post4 from '../assets/post4.png';
import post5 from '../assets/post5.png';
import post6 from '../assets/post6.png';

import type { Post, User } from './type';

// The authenticated feed has no backend endpoint yet. Keep only the data used by
// /feed, the comments placeholder and the post-likers placeholder.
const feedAuthor: User = {
    id: '00000000-0000-0000-0000-000000000000',
    username: 'ivan_petrov',
    avatarUrl: avatar1.src,
    isFollowing: false,
};

const user2: User = {
    id: 'user-2',
    username: 'ivan_ivanov',
    avatarUrl: avatar2.src,
    isFollowing: true,
};

const user3: User = {
    id: 'user-3',
    username: 'anna_smith',
    avatarUrl: avatar3.src,
    isFollowing: false,
};

const user4: User = {
    id: 'user-4',
    username: 'olga_k',
    avatarUrl: avatar1.src,
    isFollowing: true,
};

const likedByMany = [feedAuthor, user2, user3, user4];
const likedByFew = [user2, user3];

export const MOCK_POSTS: Post[] = [
    {
        id: 'post-1',
        author: feedAuthor,
        images: [
            { id: 'img-1', url: post1.src, alt: 'Beach' },
            { id: 'img-2', url: post2.src, alt: 'Ocean' },
            { id: 'img-3', url: post3.src, alt: 'Palm trees' },
        ],
        caption: 'Dream vacation. Finally made it to the ocean!',
        likesCount: 1243,
        commentsCount: 2,
        isLiked: false,
        isSaved: true,
        likedBy: likedByMany,
        createdAt: '2023-10-20T10:30:00.000Z',
    },
    {
        id: 'post-2',
        author: user2,
        images: [{ id: 'img-4', url: post4.src, alt: 'Mountains' }],
        caption: 'Silence and mountains. The best kind of getaway.',
        likesCount: 2,
        commentsCount: 1,
        isLiked: true,
        isSaved: false,
        likedBy: likedByFew,
        createdAt: '2023-10-19T14:15:00.000Z',
    },
    {
        id: 'post-3',
        author: user3,
        images: [
            { id: 'img-5', url: post5.src, alt: 'Coffee' },
            { id: 'img-6', url: post6.src, alt: 'Croissant' },
        ],
        caption: 'The morning begins with coffee.',
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        likedBy: [],
        createdAt: '2023-10-18T08:00:00.000Z',
    },
];

export const getMockFeedPosts = async (): Promise<Post[]> => [...MOCK_POSTS];

export const MOCK_COMMENTS = [
    {
        id: 'comment-1',
        postId: 'post-1',
        author: user2,
        text: 'This is simply incredible! A very beautiful place.',
        likesCount: 12,
        isLiked: false,
        createdAt: '2023-10-20T11:00:00.000Z',
        parentId: null,
        replies: [
            {
                id: 'comment-2',
                postId: 'post-1',
                author: feedAuthor,
                text: '@ivan_ivanov Thanks! I am thrilled with it myself.',
                likesCount: 2,
                isLiked: true,
                createdAt: '2023-10-20T11:05:00.000Z',
                parentId: 'comment-1',
                replies: [
                    {
                        id: 'comment-3',
                        postId: 'post-1',
                        author: user2,
                        text: 'And where exactly did you vacation?',
                        likesCount: 0,
                        isLiked: false,
                        createdAt: '2023-10-20T11:10:00.000Z',
                        parentId: 'comment-2',
                        replies: [],
                    },
                ],
            },
        ],
    },
    {
        id: 'comment-4',
        postId: 'post-1',
        author: user4,
        text: 'I want to go there too!',
        likesCount: 5,
        isLiked: false,
        createdAt: '2023-10-20T12:30:00.000Z',
        parentId: null,
        replies: [],
    },
    {
        id: 'comment-5',
        postId: 'post-2',
        author: user3,
        text: 'How beautiful! Mountains are always inspiring.',
        likesCount: 3,
        isLiked: false,
        createdAt: '2023-10-19T15:00:00.000Z',
        parentId: null,
        replies: [],
    },
];
