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
                                // Ширина плитки по колонкам сетки: 2 до 768px, 3 до 1160px, иначе 4
                                sizes="(max-width: 768px) 50vw, (max-width: 1160px) 33vw, 25vw"
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};
