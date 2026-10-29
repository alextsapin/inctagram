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
                <Image className={styles.postImage} src={postImage} alt="Фото поста" />
                <div className={styles.author}>
                    <Image
                        className={styles.authorAvatar}
                        src={authorAvatar}
                        alt={`Аватар ${username}`}
                    />
                    <h3 className={styles.authorName}>{username}</h3>
                </div>
                <div>
                    <p className={styles.publishedAt}>{publishedAt}</p>
                    <p className={styles.postText}>{postText}</p>
                </div>
            </article>
        </Link>
    );
};
