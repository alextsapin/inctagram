import { useState } from 'react';

export const useSavePost = (initialIsSaved: boolean) => {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isPending, setIsPending] = useState(false);

    const toggleSave = async (): Promise<void> => {
        setIsPending(true);
        try {
            await new Promise(resolve => {
                setTimeout(resolve, 300);
            });
            setIsSaved(prev => !prev);
        } finally {
            setIsPending(false);
        }
    };

    return { isSaved, isPending, toggleSave };
};
