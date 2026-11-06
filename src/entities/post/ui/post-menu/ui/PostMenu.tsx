'use client';

import { useRef, useState } from 'react';

import { useCloseOnOutsideClick } from '@/shared/hooks';
import { IconButton } from '@/shared/ui/icon-button';
import {
    CopyLinkIcon,
    DeleteIcon,
    EditIcon,
    FollowIcon,
    IconMore,
    UnFollowIcon,
} from '@/shared/ui/icons';

import s from './post-menu.module.scss';

type PostMenuProps = {
    postId: string;
    isOwnPost: boolean;
    isFollow: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onFollow?: () => void;
    onCopy?: () => void;
};
export const PostMenu = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postId,
    isOwnPost = false,
    isFollow = true,
    onEdit,
    onDelete,
    onFollow,
    onCopy,
}: PostMenuProps): React.JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useCloseOnOutsideClick(wrapperRef, isOpen, () => setIsOpen(false));

    const handleAction = (callback?: () => void): void => {
        callback?.();
        setIsOpen(false);
    };

    return (
        <div className={s.wrapper} ref={wrapperRef}>
            <IconButton size={24} label="More options" onClick={() => setIsOpen(!isOpen)}>
                <IconMore />
            </IconButton>

            {isOpen && (
                <div className={s.dropdown}>
                    {isOwnPost ? (
                        <>
                            <IconButton
                                size={24}
                                label="Edit post"
                                onClick={() => handleAction(onEdit)}
                                text="Edit post"
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                size={24}
                                label="Delete post"
                                onClick={() => handleAction(onDelete)}
                                text="Delete post"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                size={24}
                                label={isFollow ? 'Unfollow' : 'Follow'}
                                onClick={() => handleAction(onFollow)}
                                text={isFollow ? 'Unfollow' : 'Follow'}
                            >
                                {isFollow ? <UnFollowIcon /> : <FollowIcon />}
                            </IconButton>
                            <IconButton
                                size={24}
                                label="Copy link"
                                text="Copy link"
                                onClick={() => handleAction(onCopy)}
                            >
                                <CopyLinkIcon />
                            </IconButton>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
