import { formatAbsoluteDate } from '@/shared/lib';
import { Avatar } from '@/shared/ui/avatar';

import { User } from '../../model/type';

import s from './post-meta.module.scss';

const MAX_VISIBLE_AVATARS = 3;

type Props = {
    likedBy: User[];
    likesCount: number;
    createdAt?: string;
    onLikesClick?: () => void;
    size: number;
};
export const PostMeta = ({
    likedBy = [],
    likesCount,
    createdAt,
    onLikesClick,
    // eslint-disable-next-line no-magic-numbers
    size = 24,
}: Props): React.JSX.Element => {
    const hasLikes = likesCount > 0 && likedBy.length > 0;

    return (
        <div className={s.container}>
            <button
                type="button"
                className={s.likes}
                onClick={onLikesClick}
                disabled={!hasLikes}
            >
                {hasLikes && (
                    <div className={s.stack}>
                        {likedBy.slice(0, MAX_VISIBLE_AVATARS).map(avatar => (
                            <div key={avatar.id} className={s.item}>
                                <Avatar
                                    src={avatar.avatarUrl}
                                    alt={`${avatar.username} avatar`}
                                    size={size}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <span>
                    {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                </span>
            </button>
            {createdAt && (
                <time className={s.date} dateTime={createdAt}>
                    {formatAbsoluteDate(createdAt)}
                </time>
            )}
        </div>
    );
};
