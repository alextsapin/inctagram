'use client';

import { Button } from '@/shared/ui/button';

import s from './followButton.module.scss';

type Props = {
    userId: string;
    isFollowing: boolean;
};

export const FollowButton = ({ userId, isFollowing }: Props) => {
    const handleToggle = (): void => {
        // Todo мутация по ID
    };

    return (
        <Button
            variant={isFollowing ? 'outlined' : 'primary'}
            onClick={handleToggle}
            className={s['follow-btn']}
            aria-label={isFollowing ? `Unfollow user` : `Follow user`}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    );
};
