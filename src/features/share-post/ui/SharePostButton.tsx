'use client';

import { IconButton } from '@/shared/ui/icon-button';
import { ShareIcon } from '@/shared/ui/icons';

import { useSharePost } from '../model/useSharePost';

type Props = {
    postId?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SharePostButton = ({ postId }: Props): React.JSX.Element => {
    const { isCopied, handleShare } = useSharePost();

    // TODO модалка с сообщениями
    return (
        <IconButton
            size={24}
            label={isCopied ? 'Link copied!' : 'Share post'}
            isActive={isCopied}
            onClick={handleShare}
        >
            <ShareIcon />
        </IconButton>
    );
};
