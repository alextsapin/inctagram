'use client';

/* eslint-disable prettier/prettier */
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Language } from '@/features/change-language';
import logo from '@/widgets/header/assets/logo.svg';
import css from '@/widgets/header/ui/header.module.scss';

export const Header = (): React.JSX.Element => {
    const pathname = usePathname();
    const showAuthLinks = pathname !== '/sign-up' && pathname !== '/sign-in';

    return (
        <header className={css.header}>
            <div className={`container ${css.inner}`}>
                <Link href="/" className={css.logo}>
                    <Image src={logo} width={124} height={25} priority alt="logo" />
                </Link>

                <div className={css.language}>
                    <Language />
                </div>

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
