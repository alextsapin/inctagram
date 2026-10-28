'use client';

/* eslint-disable prettier/prettier */
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCurrentUser } from '@/entities/session';
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

// TODO: Перейти на SSR-авторизацию (Server Component) для устранения мигания,
// когда появится реальный API.
export const Header = (): React.JSX.Element => {
    const pathname = usePathname();
    const { data: user, isError, isPending } = useCurrentUser();

    // Пока статус авторизации не определён, не показываем ни кнопки входа,
    // ни колокольчик, чтобы не было мигания при гидрации.
    const isAuthPending = isPending;
    const isAuthed = Boolean(user) && !isError;

    // На страницах входа кнопки входа не показываем.
    const isAuthPage = pathname === '/sign-up' || pathname === '/sign-in';
    const showAuthLinks = !isAuthPage && !isAuthed && !isAuthPending;
    // На собственном профиле (корневой маршрут /profile) название сети и выбор
    // языка скрыты, как в макете.
    const isProfileRoot = pathname === '/profile';
    const showLogo = !isProfileRoot;
    const showLanguage = !isProfileRoot;
    // На всех страницах профиля, кроме корневого /profile (paid, settings,
    // /profile/[username]), действия (колокольчик/кнопки + язык) размещены
    // справа, как в макете.
    const isProfileChild = Boolean(pathname?.startsWith('/profile')) && !isProfileRoot;
    const showProfileActions = isProfileChild;
    const showNotifications = isProfileChild && isAuthed;

    return (
        <header className={css.header}>
            <div
                className={`container ${css.inner} ${
                    showNotifications || showProfileActions
                        ? css['inner--notifications']
                        : ''
                }`}
            >
                {showLogo && (
                    <Link href="/" className={css.logo}>
                        <Image src={logo} width={124} height={25} priority alt="logo" />
                    </Link>
                )}

                {showProfileActions && showNotifications && (
                    <div className={css['header-actions']}>
                        <NotificationsBell />
                        <div className={css.language}>
                            <Language />
                        </div>
                    </div>
                )}

                {showProfileActions && !showNotifications && !isAuthPending && (
                    <div className={css['header-actions']}>
                        <div className={css.language}>
                            <Language />
                        </div>
                        <div className={css.wrap}>
                            <Link href="/sign-in/" className={css.link}>
                                Sign in
                            </Link>
                            <Link href="/sign-up/" className={css.button}>
                                Sign up
                            </Link>
                        </div>
                    </div>
                )}

                {showProfileActions && !showNotifications && isAuthPending && (
                    <div className={css['header-actions']}>
                        <div className={css.language}>
                            <Language />
                        </div>
                    </div>
                )}

                {!showProfileActions && showLanguage && (
                    <div className={css.language}>
                        <Language />
                    </div>
                )}

                {showAuthLinks && !showProfileActions && (
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
