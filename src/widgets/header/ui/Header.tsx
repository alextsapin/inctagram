'use client';

/* eslint-disable prettier/prettier */
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Language } from '@/features/change-language';
import logo from '@/widgets/header/assets/logo.svg';
import css from '@/widgets/header/ui/header.module.scss';

// Иконка колокольчика уведомлений из макета Pixso (Outline bell 24×24).
const BellIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.73 21a2 2 0 01-3.46 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// Колокольчик с бейджем непрочитанных уведомлений (в макете — «3»).
const NotificationsBell = (): React.JSX.Element => (
    <span className={css.bell}>
        <BellIcon />
        <span className={css['bell-badge']}>3</span>
    </span>
);

export const Header = (): React.JSX.Element => {
    const pathname = usePathname();
    // На страницах своего профиля (без бейджа и paid) кнопки входа скрыты, как в макете.
    const showAuthLinks =
        pathname !== '/sign-up' &&
        pathname !== '/sign-in' &&
        pathname !== '/profile' &&
        pathname !== '/profile/paid';
    // На собственном профиле название сети (логотип) и выбор языка скрыты, как в макете.
    const showLogo = pathname !== '/profile';
    const showLanguage = pathname !== '/profile';
    // Колокольчик уведомлений показываем на странице платного профиля, как в макете.
    const showNotifications = pathname === '/profile/paid';

    return (
        <header className={css.header}>
            <div
                className={`container ${css.inner} ${
                    showNotifications ? css['inner--notifications'] : ''
                }`}
            >
                {showLogo && (
                    <Link href="/" className={css.logo}>
                        <Image src={logo} width={124} height={25} priority alt="logo" />
                    </Link>
                )}

                {showNotifications ? (
                    <div className={css['header-actions']}>
                        <NotificationsBell />
                        <div className={css.language}>
                            <Language />
                        </div>
                    </div>
                ) : (
                    showLanguage && (
                        <div className={css.language}>
                            <Language />
                        </div>
                    )
                )}

                {showAuthLinks && (
                    <div className={css.wrap}>
                        <Link href="/sign-in/" className={css.link}>
                            Sign in
                        </Link>
                        <Link href="/sign-up/" className={css.button}>
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
