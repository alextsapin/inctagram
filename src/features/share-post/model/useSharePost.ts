// src/features/share-post/model/useSharePost.ts
import { useState } from 'react';

export const useSharePost = (postId: string) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = () => {
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return { isCopied, handleShare };
};
