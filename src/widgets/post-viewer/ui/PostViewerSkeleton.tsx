/* eslint-disable no-magic-numbers */
import s from './post-viewer-skeleton.module.scss';

export const PostViewerSkeleton = (): React.JSX.Element => {
    return (
        <div className={s.wrapper}>
            <div className={s.content}>
                {/* --- ЛЕВАЯ КОЛОНКА (Картинка) --- */}
                <div className={s['carousel-wrapper']}>
                    <div className={s['image-skeleton']} />
                </div>

                {/* --- ПРАВАЯ КОЛОНКА (Сайдбар) --- */}
                <div className={s.sidebar}>
                    {/* 1. Шапка */}
                    <div className={s.header}>
                        <div className={`${s.skeleton} ${s['avatar-circle']}`} />
                        <div className={`${s.skeleton} ${s['username-line']}`} />
                    </div>

                    {/* 2. Комментарии */}
                    <div className={s.comments}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className={s.comment}>
                                <div className={`${s.skeleton} ${s['avatar-circle']}`} />
                                <div className={s['comment-body']}>
                                    <div
                                        className={`${s.skeleton} ${s['text-line-full']}`}
                                    />
                                    <div
                                        className={`${s.skeleton} ${s['text-line-short']}`}
                                    />
                                    <div className={`${s.skeleton} ${s['meta-line']}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 3. Футер (Действия, Лайки, Инпут) */}
                    <div className={s.footer}>
                        <div className={s['actions-panel']}>
                            <div className={s['left-actions']}>
                                <div className={`${s.skeleton} ${s['icon-skeleton']}`} />
                                <div className={`${s.skeleton} ${s['icon-skeleton']}`} />
                            </div>
                            <div className={`${s.skeleton} ${s['icon-skeleton']}`} />
                        </div>

                        <div className={s.meta}>
                            <div className={s['avatars-stack']}>
                                <div className={`${s.skeleton} ${s['avatar-small']}`} />
                                <div className={`${s.skeleton} ${s['avatar-small']}`} />
                                <div className={`${s.skeleton} ${s['avatar-small']}`} />
                            </div>
                            <div className={`${s.skeleton} ${s['likes-line']}`} />
                            <div className={`${s.skeleton} ${s['date-line']}`} />
                        </div>

                        <div className={s['form-wrapper']}>
                            <div className={`${s.skeleton} ${s['input-line']}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
