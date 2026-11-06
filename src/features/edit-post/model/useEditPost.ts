/* eslint-disable no-magic-numbers */
import { useState } from 'react';

type EditPostPayload = {
    postId: string;
    caption: string;
};
type UseEditPostReturn = {
    mutateAsync: (payload: EditPostPayload) => Promise<void>;
    isPending: boolean;
};
export const useEditPost = (): UseEditPostReturn => {
    const [isPending, setIsPending] = useState(false);

    const mutateAsync = async (payload: EditPostPayload): Promise<void> => {
        setIsPending(true);

        await new Promise(resolve => {
            setTimeout(() => resolve(payload), 800);
        });

        setIsPending(false);
    };

    return { mutateAsync, isPending };
};
