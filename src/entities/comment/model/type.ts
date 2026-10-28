import { User } from '@/entities/post/';

export type CommentType = {
    id: string;
    postId: string;
    author: User;
    text: string;
    parentId?: string | null;
    likesCount: number;
    isLiked: boolean;
    createdAt: string;
    replies?: CommentType[];
};
