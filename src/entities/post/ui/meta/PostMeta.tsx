import { formatAbsoluteDate } from '@/shared/lib';
import { Avatar } from '@/shared/ui/avatar';

import { User } from '../../model/type';

import s from './postMeta.module.scss';

type Props = {
    likedBy: User[];
    likesCount: number;
    createdAt: string;
    onLikesClick?: () => void;
};
export const PostMeta = ({
    likedBy,
    likesCount,
    createdAt,
    onLikesClick,
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
                        {likedBy.slice(0, 3).map(avatar => (
                            <div key={avatar.id} className={s.item}>
                                <Avatar
                                    src={avatar.avatarUrl}
                                    alt={`${avatar.username} avatar`}
                                    size={36}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <span>
                    {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                </span>
            </button>
            <time className={s.date} dateTime={createdAt}>
                {formatAbsoluteDate(createdAt)}
            </time>
        </div>
    );
};
