import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/entities/post/model/type';

import s from './post-grid.module.scss';

type Props = {
    posts: Post[];
};
export const PostGrid = ({ posts }: Props): React.JSX.Element => {
    if (posts.length === 0) {
        return <div className={s.empty}>Постов пока нет</div>;
    }

    return (
        <div className={s.grid}>
            {posts.map(post => {
                const imageUrl = post.images?.[0]?.url;

                return (
                    <Link key={post.id} href={`/post/${post.id}`} className={s.item}>
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt=""
                                fill
                                className={s.image}
                                // Ширина плитки: на телефоне половина экрана, иначе не больше 234px
                                sizes="(max-width: 768px) 50vw, 234px"
                                // Ленивая загрузка (задача 12: «В PostGrid поставить ленивую загрузку»).
                                // eager был временным решением, пока постов в профиле мало.
                                loading="lazy"
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};
