'use client';

import { useCallback } from 'react';

import { useInfiniteScroll } from '@/shared/hooks';

import { useUserPostsInfinite } from '../../model/useUserPostsInfinite';
import { PostGrid } from '../post-grid';

import s from './infinite-post-grid.module.scss';

type InfinitePostGridProps = {
    username: string;
};

// Бесконечная загрузка постов профиля (задача 12 / BLD-142).
// Композиция: чистый PostGrid + useInfiniteScroll + состояния загрузки.
export const InfinitePostGrid = ({
    username,
}: InfinitePostGridProps): React.JSX.Element => {
    const {
        posts,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
        isError,
        isFetchNextPageError,
        refetch,
    } = useUserPostsInfinite(username);

    // onLoadMore должна быть мемоизирована, иначе observer пересоздаётся каждый рендер.
    const onLoadMore = useCallback(() => fetchNextPage(), [fetchNextPage]);

    const sentinelRef = useInfiniteScroll({
        onLoadMore,
        // Обязательное поле: защита от повторного срабатывания, пока идёт ЛЮБАЯ загрузка.
        // isFetching (а не isFetchingNextPage) покрывает и фоновый refetch первой страницы:
        // во время него observer не должен вызывать fetchNextPage параллельно.
        isLoading: isFetching,
        // Когда false — подгрузка не запускается (дошли до конца списка).
        // При ошибке следующей страницы (isFetchNextPageError) hasMore становится false:
        // иначе observer пересоздаётся с isIntersecting=true и бесконечно повторяет
        // fetchNextPage упавшей страницы (retry+backoff).
        hasMore: hasNextPage && !isFetchNextPageError,
    });

    if (isLoading) {
        return (
            <div className={s.loading} role="status">
                <span className={s.spinner} />
                Loading posts…
            </div>
        );
    }

    // Ошибка первой загрузки: постов ещё нет, показываем ошибку вместо сетки.
    if (isError && posts.length === 0) {
        return (
            <div className={s.error} role="alert">
                Failed to load posts.
                <button type="button" onClick={refetch}>
                    Retry
                </button>
            </div>
        );
    }

    // Пустое состояние (нет постов) рендерится внутри PostGrid, свой текст не дублируем.
    if (posts.length === 0) {
        return <PostGrid posts={posts} />;
    }

    // Есть загруженные посты: сетку сохраняем. Ошибка следующей страницы (isFetchNextPageError)
    // показывается под сеткой с Retry, а не вместо уже загруженного списка.
    return (
        <>
            <PostGrid posts={posts} />

            <div ref={sentinelRef} className={s.sentinel}>
                {isError && isFetchNextPageError && (
                    <div className={s.error} role="alert">
                        Failed to load more posts.
                        <button type="button" onClick={refetch}>
                            Retry
                        </button>
                    </div>
                )}

                {!isError && isFetchingNextPage && (
                    <div className={s.loading} role="status">
                        <span className={s.spinner} />
                        Loading more…
                    </div>
                )}

                {!isError && !hasNextPage && (
                    <div className={s.loading} role="status">
                        No more posts
                    </div>
                )}
            </div>
        </>
    );
};
