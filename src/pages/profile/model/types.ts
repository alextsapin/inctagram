export type ProfileStats = {
    following: number;
    followers: number;
    publications: number;
};

export type Profile = {
    username: string;
    aboutMe: string;
    avatarUrl: string;
    stats: ProfileStats;
    // TODO: заменить на поле подтверждения из API, когда оно появится.
    isVerified: boolean;
};

export type Comment = {
    id: string;
    username: string;
    avatarUrl: string;
    text: string;
    createdAt: string;
};

export type Post = {
    id: string;
    images: string[];
    likes: number;
    createdAt: string;
    comments: Comment[];
};
