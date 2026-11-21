import s from './post-edit-skeleton.module.scss';

export const PostEditSkeleton = (): React.JSX.Element => {
    return (
        <div className={s.wrapper}>
            {/* Левая часть: Заглушка картинки */}
            <div className={s['image-wrapper']}>
                <div className={s['image-skeleton']} />
            </div>

            {/* Правая часть: Инфо и Форма */}
            <div className={s.sidebar}>
                {/* Шапка с автором */}
                <div className={s.header}>
                    <div className={`${s.skeleton} ${s.avatar}`} />
                    <div className={`${s.skeleton} ${s.username}`} />
                </div>

                {/* Тело формы */}
                <div className={s.body}>
                    <div className={`${s.skeleton} ${s.label}`} />
                    <div className={`${s.skeleton} ${s.textarea}`} />
                    <div className={`${s.skeleton} ${s.counter}`} />
                </div>

                {/* Футер с кнопкой */}
                <div className={s.footer}>
                    <div className={`${s.skeleton} ${s.button}`} />
                </div>
            </div>
        </div>
    );
};
