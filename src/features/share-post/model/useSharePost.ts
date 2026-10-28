// src/features/share-post/model/useSharePost.ts
import { useState } from 'react';

export const useSharePost = (): { isCopied: any; handleShare: any } => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = (): void => {
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
            // eslint-disable-next-line no-magic-numbers
        }, 2000);
    };

    return { isCopied, handleShare };
};
