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
    previewUrl?: string | null;
    caption?: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isSaved: boolean;
    likedBy: User[];
    createdAt: string;
};

// Страница постов пользователя для бесконечной загрузки (задача 12 / BLD-142).
// nextCursor — id последнего поста страницы (следующий pageParam), либо null,
// если постов больше нет.
export type UserPostsPage = {
    posts: Post[];
    nextCursor: string | null;
};
