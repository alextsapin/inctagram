import Image from 'next/image';
import Link from 'next/link';

import { MOCK_POSTS } from '@/entities/post';
import { Post } from '@/entities/post/model/type';

import s from './postGrid.module.scss';

type Props = {
    posts?: Post[];
};

export const PostGrid = ({ posts = MOCK_POSTS }: Props): React.JSX.Element => {
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
                                sizes="(max-width: 768px) 33vw, 25vw"
                            />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};
