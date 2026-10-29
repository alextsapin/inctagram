'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import css from './sidebar.module.scss';

type NavItem = {
    label: string;
    href: string;
    icon: React.JSX.Element;
};

const FeedIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M3 10.5L12 3l9 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5 9.5V21h14V9.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CreateIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M12 8v8M8 12h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const ProfileIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path
            d="M4 21c0-4 3.6-6 8-6s8 2 8 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const MessengerIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M21 11.5a9 9 0 10-3.6 7.2L21 21l-1.1-3.4A9 9 0 0021 11.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const SearchIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path
            d="M21 21l-4.3-4.3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const FavoritesIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
    </svg>
);

const StatisticsIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M3 17l6-6 4 4 8-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17 7h4v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LogOutIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16 17l5-5-5-5M21 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const navItems: NavItem[] = [
    { label: 'Feed', href: '/feed', icon: <FeedIcon /> },
    { label: 'Create', href: '/create', icon: <CreateIcon /> },
    { label: 'My Profile', href: '/profile', icon: <ProfileIcon /> },
    { label: 'Messenger', href: '/messenger', icon: <MessengerIcon /> },
    { label: 'Search', href: '/search', icon: <SearchIcon /> },
];

const bottomItems: NavItem[] = [
    { label: 'Statistics', href: '/statistics', icon: <StatisticsIcon /> },
    { label: 'Favorites', href: '/favorites', icon: <FavoritesIcon /> },
];

export const Sidebar = (): React.JSX.Element => {
    const pathname = usePathname();

    const isActive = (href: string): boolean =>
        pathname === href || Boolean(pathname?.startsWith(`${href}/`));

    return (
        <nav className={css.sidebar}>
            <ul className={css.list}>
                {navItems.map(item => (
                    <li key={item.label}>
                        <Link
                            href={item.href}
                            className={
                                isActive(item.href)
                                    ? `${css.item} ${css['item-active']}`
                                    : css.item
                            }
                            aria-current={isActive(item.href) ? 'page' : undefined}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className={css.bottom}>
                <ul className={css.list}>
                    {bottomItems.map(item => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className={
                                    isActive(item.href)
                                        ? `${css.item} ${css['item-active']}`
                                        : css.item
                                }
                                aria-current={isActive(item.href) ? 'page' : undefined}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link href="/logout" className={css.item}>
                    <LogOutIcon />
                    <span>Log Out</span>
                </Link>
            </div>
        </nav>
    );
};
