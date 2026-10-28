'use client';

import React from 'react';

import { IconButton } from '@/shared/ui/icon-button';
import { SaveFilledIcon, SaveIcon } from '@/shared/ui/icons';

import { useSavePost } from '../model/useSavePost';

type Props = {
    postId: string;
    isSaved: boolean;
};

export const SavePostButton = ({ postId, isSaved }: Props): React.JSX.Element => {
    const { isSaved: isCurrentlySaved, isPending, toggleSave } = useSavePost(isSaved);

    // TODO мутация по ID
    return (
        <IconButton
            size={24}
            label={isCurrentlySaved ? 'Remove from saved' : 'Save'}
            isActive={isCurrentlySaved}
            disabled={isPending}
            onClick={toggleSave}
        >
            {isCurrentlySaved ? <SaveFilledIcon /> : <SaveIcon />}
        </IconButton>
    );
};
