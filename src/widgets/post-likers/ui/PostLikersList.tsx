'use client';

import { useState } from 'react';

import { MOCK_POSTS } from '@/entities/post';
import { FollowButton } from '@/features/toggle-follow';
import { Avatar } from '@/shared/ui/avatar';
import { SearchIcon } from '@/shared/ui/icons';
import { Input } from '@/shared/ui/input';

import s from './post-likes-llst.module.scss';

type Props = {
    postId: string;
};

export const PostLikesList = ({ postId }: Props): React.JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');

    //  Загружаем список лайкнувших с сервера
    const post = MOCK_POSTS.find(p => p.id === postId);

    const users = post?.likedBy || [];

    const filteredUsers =
        users?.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || [];

    return (
        <div className={s.wrapper}>
            <div className={s['search-wrapper']}>
                <div className={s['search-container']}>
                    <SearchIcon className={s['search-icon']} />
                    <Input
                        type="search"
                        className={s['search-input']}
                        placeholder="Search"
                        onChange={e => setSearchQuery(e.target.value)}
                        value={searchQuery}
                    />
                </div>
            </div>

            <div className={s.list}>
                {filteredUsers.length === 0 && (
                    <p className={s.empty}>Никого не найдено</p>
                )}

                {filteredUsers.map(user => (
                    <div key={user.id} className={s['user-row']}>
                        <div className={s['user-info']}>
                            <Avatar src={user.avatarUrl} alt={user.username} size={32} />
                            <span className={s.username}>{user.username}</span>
                        </div>

                        <FollowButton
                            userId={user.id}
                            isFollowing={user.isFollowing ?? false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
