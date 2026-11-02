import { useState } from 'react';

export const useSavePost = (
    initialIsSaved: boolean,
): { isSaved: boolean; isPending: boolean; toggleSave: () => Promise<void> } => {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isPending, setIsPending] = useState(false);

    const toggleSave = async (): Promise<void> => {
        setIsPending(true);
        try {
            await new Promise(resolve => {
                // eslint-disable-next-line no-magic-numbers
                setTimeout(resolve, 300);
            });
            setIsSaved(prev => !prev);
        } finally {
            setIsPending(false);
        }
    };

    return { isSaved, isPending, toggleSave };
};
