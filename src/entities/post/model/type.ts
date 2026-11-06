export type User = {
    id: string;
    username: string;
    avatarUrl: string;
    fullName?: string;
    isFollowing?: boolean;
};
export type PostImage = {
    id: string;
    url: string;
    alt?: string;
};

export type Post = {
    id: string;
    author: User;
    images: PostImage[];
    caption?: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isSaved: boolean;
    likedBy: User[];
    createdAt: string;
};
