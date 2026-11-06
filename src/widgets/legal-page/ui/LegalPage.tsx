import Image from 'next/image';
import Link from 'next/link';

import arrowBack from '../assets/arrow-back.svg';

import css from './legal-page.module.scss';

const ICON_SIZE = 24;

type LegalPageProps = {
    title: string;
    // Каждая строка массива — отдельный абзац
    paragraphs: string[];
};

// Общая разметка для страниц Terms of Service и Privacy Policy:
// ссылка назад, заголовок и текст по центру
export const LegalPage = ({ title, paragraphs }: LegalPageProps): React.JSX.Element => {
    return (
        <main className="container">
            {/* Пока сюда попадают только с регистрации, поэтому ссылка на /sign-up */}
            <Link href="/sign-up" className={css.back}>
                {/* Стрелка для красоты, alt пустой: скринридер прочитает текст ссылки */}
                <Image src={arrowBack} alt="" width={ICON_SIZE} height={ICON_SIZE} />
                Back to Sign Up
            </Link>

            <h1 className={css.title}>{title}</h1>

            <div className={css.text}>
                {paragraphs.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </main>
    );
};
