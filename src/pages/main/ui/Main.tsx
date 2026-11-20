import { PostCard } from '@/widgets/post-card';
import { RegisteredUsers } from '@/widgets/registered-users';

import { getMainPageData } from '../api/getMainPageData';

import style from './main.module.scss';
import { MainClientLayout } from './MainClientLayout';

const COUNTER_LENGTH = 6;

export const Main = async (): Promise<React.JSX.Element> => {
    const data = await getMainPageData();

    if (data.source === 'unavailable') {
        return (
            <MainClientLayout>
                <p role="alert">
                    Publications are temporarily unavailable. Please try again later.
                </p>
            </MainClientLayout>
        );
    }

    const { posts, registeredUsersCount } = data;
    const registeredUsers = String(registeredUsersCount).padStart(COUNTER_LENGTH, '0');

    return (
        <MainClientLayout>
            {data.source === 'mock' && <span>Demo data</span>}

            <RegisteredUsers values={registeredUsers} />

            <div className={style.container}>
                {posts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    posts.map(post => (
                        <PostCard
                            key={post.id}
                            postId={post.id}
                            username={post.author.username}
                            authorAvatar={post.author.avatarUrl ?? '/profile/avatar.png'}
                            createdAt={post.createdAt}
                            postText={post.description}
                            images={post.photos.map(photo => ({
                                id: String(photo.id),
                                url: photo.url,
                            }))}
                        />
                    ))
                )}
            </div>
        </MainClientLayout>
    );
};
