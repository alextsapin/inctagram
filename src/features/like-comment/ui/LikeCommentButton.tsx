'use client';

import { IconButton } from '@/shared/ui/icon-button';
import { HeartFilledIcon, HeartIcon } from '@/shared/ui/icons';

import { useLikeComment } from '../model/useLikeComment';

type Props = {
    commentId: string;
    isLiked: boolean;
};

export const LikeCommentButton = ({ commentId, isLiked }: Props): React.JSX.Element => {
    const { isLike, isPending, toggleLike } = useLikeComment(isLiked);

    // TODO мутация по id
    return (
        <IconButton
            size={15}
            label={isLiked ? 'Unlike comment' : 'Like comment'}
            disabled={isPending}
            onClick={toggleLike}
            isActive={isLiked}
        >
            {isLike ? <HeartFilledIcon color="red" /> : <HeartIcon />}
        </IconButton>
    );
};
