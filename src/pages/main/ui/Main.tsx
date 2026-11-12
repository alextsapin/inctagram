/* eslint-disable no-magic-numbers */
import { getMockLatestPosts, MOCK_REGISTERED_USERS_COUNT } from '@/entities/post';
import { RegisteredUsers } from '@/widgets/registered-users';
import { UserCard } from '@/widgets/user-post-card';

import nature from '../assets/nature.jpg';
import tanya from '../assets/tanya.jpg';

import style from './main.module.scss';
import { MainClientLayout } from './MainClientLayout';

const POSTS_LIMIT = 4;
const COUNTER_LENGTH = 6;

export const Main = (): React.JSX.Element => {
    const posts = getMockLatestPosts(POSTS_LIMIT);
    const registeredUsers = String(MOCK_REGISTERED_USERS_COUNT).padStart(
        COUNTER_LENGTH,
        '0',
    );

    return (
        <MainClientLayout>
            <RegisteredUsers values={registeredUsers} />

            <div className={style.container}>
                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    posts.map(post => (
                        <UserCard
                            key={post.id}
                            username={post.author.username}
                            publishedAt={post.createdAt.slice(0, 10)}
                            postText={post.caption}
                            postImage={nature}
                            authorAvatar={tanya}
                        />
                    ))
                )}
            </div>
        </MainClientLayout>
    );
};
