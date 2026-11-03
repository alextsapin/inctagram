'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useCurrentUser } from '@/entities/session';
import { ProfileLayout } from '@/widgets/profile-layout';

import illustration from '../assets/under-construction.svg';

import css from './under-construction.module.scss';

type UnderConstructionProps = {
    // Название страницы, например «Messenger»
    title: string;
};

// Заглушка для страниц, которые ещё не сделаны.
// Вошедший пользователь видит сайдбар и уходит по нему на другие страницы,
// гостю сайдбар не показываем, поэтому даём кнопку на главную
export const UnderConstruction = ({
    title,
}: UnderConstructionProps): React.JSX.Element => {
    const { data: user, isError } = useCurrentUser();
    const isAuthed = Boolean(user) && !isError;

    const content = (
        <div className={css.root}>
            <h1 className={css.title}>{title}</h1>
            <p>This page is under construction</p>

            {/* alt пустой: картинка для красоты, смысл передаёт текст выше */}
            <Image className={css.image} src={illustration} alt="" />

            {!isAuthed && (
                <Link href="/" className={css.link}>
                    Back to Main
                </Link>
            )}
        </div>
    );

    // Гость: без сайдбара, с кнопкой на главную
    if (!isAuthed) {
        return <main className={`container ${css.guest}`}>{content}</main>;
    }

    // Вошедший: сайдбар слева, как на главной и в профиле
    return <ProfileLayout withSidebar>{content}</ProfileLayout>;
};
