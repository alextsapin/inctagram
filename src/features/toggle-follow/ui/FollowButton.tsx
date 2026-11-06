'use client';

import { Button } from '@/shared/ui/button';

import s from './follow-button.module.scss';

type Props = {
    userId: string;
    isFollowing: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FollowButton = ({ userId, isFollowing }: Props): React.JSX.Element => {
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
