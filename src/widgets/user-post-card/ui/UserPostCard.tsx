import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import styles from './user-post-card.module.scss';

type UserCardProps = {
    username?: string;
    postText?: string;
    publishedAt?: string;
    postImage: StaticImageData;
    authorAvatar: StaticImageData;
};

export const UserCard = ({
    username,
    publishedAt,
    postText,
    postImage,
    authorAvatar,
}: UserCardProps): React.JSX.Element => {
    return (
        <Link href="/" className={styles.link}>
            <article className={styles.card}>
                <Image
                    className={styles['post-image']}
                    src={postImage}
                    alt="Post photo"
                />
                <div className={styles.author}>
                    <Image
                        className={styles['author-avatar']}
                        src={authorAvatar}
                        alt={`${username} avatar`}
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
