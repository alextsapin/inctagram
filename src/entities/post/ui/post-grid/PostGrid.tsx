import { Post } from '@/entities/post/model/type';

import s from './post-grid.module.scss';
import { PostGridItem } from './PostGridItem';

type Props = {
    posts: Post[];
};
export const PostGrid = ({ posts }: Props): React.JSX.Element => {
    if (posts.length === 0) {
        return <div className={s.empty}>Постов пока нет</div>;
    }

    return (
        <div className={s.grid}>
            {posts.map(post => (
                <PostGridItem
                    key={post.id}
                    postId={post.id}
                    // В сетке показываем превью. Пока бэкенд его не сделал, берём первое фото
                    previewUrl={post.previewUrl}
                    photoUrl={post.images[0]?.url}
                />
            ))}
        </div>
    );
};
