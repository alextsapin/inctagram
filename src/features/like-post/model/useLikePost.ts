/* eslint-disable @typescript-eslint/explicit-function-return-type */

'use client';

import { useState } from 'react';

export const useLikePost = (initialIsLiked: boolean) => {
    const [isLike, setIsLiked] = useState(initialIsLiked);
    const [isPending, setIsPending] = useState(false);

    const toggleLike = async (): Promise<void> => {
        setIsPending(true);
        try {
            await new Promise(resolve => {
                setTimeout(resolve, 300);
            });
            setIsLiked(prev => !prev);
        } finally {
            setIsPending(false);
        }
    };

    return { isLike, isPending, toggleLike };
};
