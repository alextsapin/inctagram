import type { JSX } from 'react';

import Image from 'next/image';

import type { Post } from '../model/types';

import css from './posts-grid.module.scss';

type PostsGridProps = {
    posts: Post[];
    onPostClick: (post: Post) => void;
};

export const PostsGrid = ({ posts, onPostClick }: PostsGridProps): JSX.Element => {
    return (
        <section className={css.grid} aria-label="Publications">
            {posts.map(post => (
                <button
                    key={post.id}
                    type="button"
                    className={css.post}
                    onClick={() => onPostClick(post)}
                    aria-label="Open publication"
                >
                    <Image
                        src={post.images[0]}
                        alt="publication"
                        fill
                        className={css.image}
                        sizes="(max-width: 768px) 50vw, (max-width: 1160px) 33vw, 234px"
                    />
                </button>
            ))}
        </section>
    );
};
