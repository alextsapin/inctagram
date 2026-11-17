import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import styles from './user-post-card.module.scss';

const POST_IMAGE_WIDTH = 234;
const POST_IMAGE_HEIGHT = 240;
const AUTHOR_AVATAR_SIZE = 36;

type UserCardProps = {
    postId: string;
    username?: string;
    postText?: string;
    publishedAt?: string;
    postImage: string | StaticImageData;
    authorAvatar: string | StaticImageData;
};

export const UserCard = ({
    postId,
    username,
    publishedAt,
    postText,
    postImage,
    authorAvatar,
}: UserCardProps): React.JSX.Element => {
    return (
        <Link href={`/post/${postId}`} className={styles.link}>
            <article className={styles.card}>
                <Image
                    className={styles['post-image']}
                    src={postImage}
                    alt="Post photo"
                    width={POST_IMAGE_WIDTH}
                    height={POST_IMAGE_HEIGHT}
                />
                <div className={styles.author}>
                    <Image
                        className={styles['author-avatar']}
                        src={authorAvatar}
                        alt={`${username} avatar`}
                        width={AUTHOR_AVATAR_SIZE}
                        height={AUTHOR_AVATAR_SIZE}
                    />
                    <h3 className={styles['author-name']}>{username}</h3>
                </div>
                <div>
                    <p className={styles['published-at']}>{publishedAt}</p>
                    <p className={styles['post-text']}>{postText}</p>
                </div>
            </article>
        </Link>
    );
};
