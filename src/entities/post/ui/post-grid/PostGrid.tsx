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
                    // Ссылки тоже в key: если у поста поменялось превью или фото
                    // (например, превью появилось после обновления данных), плитка
                    // создаётся заново, и состояние загрузки начинается с нуля
                    key={`${post.id}:${post.previewUrl ?? ''}:${
                        post.images[0]?.url ?? ''
                    }`}
                    postId={post.id}
                    // В сетке показываем превью. Пока бэкенд его не сделал, берём первое фото
                    previewUrl={post.previewUrl}
                    photoUrl={post.images[0]?.url}
                />
            ))}
        </div>
    );
};
