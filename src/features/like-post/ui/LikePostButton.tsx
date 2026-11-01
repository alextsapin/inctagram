'use client';

import { IconButton } from '@/shared/ui/icon-button';
import { HeartFilledIcon, HeartIcon } from '@/shared/ui/icons';

import { useLikePost } from '../model/useLikePost';

type Props = {
    postId: string;
    isLiked: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LikePostButton = ({ postId, isLiked }: Props): React.JSX.Element => {
    // TODO мутация по id
    const { isLike, isPending, toggleLike } = useLikePost(isLiked);

    return (
        <IconButton
            size={24}
            label={isLike ? 'Unlike' : 'Like'}
            isActive={isLike}
            disabled={isPending}
            onClick={toggleLike}
        >
            {isLike ? <HeartFilledIcon color="red" /> : <HeartIcon />}
        </IconButton>
    );
};
