export type User = {
    id: string;
    username: string;
    avatarUrl: string;
    fullName?: string;
    isFollowing?: boolean;
};

// TODO (задача 1): когда бэкенд назовёт поля, добавить в PostImage отдельные
// адреса превью и полного фото (например previewUrl / fullUrl) и использовать
// их соответственно в сетке (превью) и в просмотре поста (полное фото).
// Сейчас на этапе моков для обоих случаев используется один url.
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

// Страница постов пользователя для бесконечной загрузки (задача 12 / BLD-142).
// nextCursor — id последнего поста страницы (следующий pageParam), либо null,
// если постов больше нет.
export type UserPostsPage = {
    posts: Post[];
    nextCursor: string | null;
};
