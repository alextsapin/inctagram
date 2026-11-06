'use client';

import { useCurrentUser } from '@/entities/session';
import { ProfileLayout } from '@/widgets/profile-layout';
import { RegisteredUsers } from '@/widgets/registered-users';
import { UserCard } from '@/widgets/user-post-card';

import nature from '../assets/nature.jpg';
import tanya from '../assets/tanya.jpg';

import style from './main.module.scss';

const posts = [
    {
        id: 1,
        username: 'UserName',
        publishedAt: '22 min ago',
        postText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        postImage: nature,
        authorAvatar: tanya,
    },
    {
        id: 2,
        username: 'AnotherUser',
        publishedAt: '1 hour ago',
        postText: 'ALorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quia?',
        postImage: nature,
        authorAvatar: tanya,
    },
    {
        id: 3,
        username: 'ThirdUser',
        publishedAt: '3 hours ago',
        postText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quia?',
        postImage: nature,
        authorAvatar: tanya,
    },
    {
        id: 4,
        username: 'FourthUser',
        publishedAt: 'Yesterday',
        postText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quia?',
        postImage: nature,
        authorAvatar: tanya,
    },
];

export const Main = (): React.JSX.Element => {
    const { data: user, isError } = useCurrentUser();
    const isAuthed = Boolean(user) && !isError;

    const content = (
        <>
            <RegisteredUsers />
            <div className={style.container}>
                {posts.map(post => (
                    <UserCard key={post.id} {...post} />
                ))}
            </div>
        </>
    );

    // Гость: главная без сайдбара
    if (!isAuthed) {
        return <main className={style.main}>{content}</main>;
    }

    // Вошедший пользователь: сайдбар слева, как в макете и в ленте.
    // <main> рисует ProfileLayout, поэтому здесь div
    return (
        <ProfileLayout withSidebar>
            <div className={style.main}>{content}</div>
        </ProfileLayout>
    );
};
