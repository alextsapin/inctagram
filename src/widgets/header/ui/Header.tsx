/* eslint-disable prettier/prettier */
import Image from 'next/image';
import Link from 'next/link';

import { Language } from '@/features/change-language';
import logo from '@/widgets/header/assets/logo.svg';
import css from '@/widgets/header/ui/header.module.scss';

export const Header = (): React.JSX.Element => {
    return (
        <header className={css.header}>
            <div className="container">
                <div className={css.inner}>
                    <Link href="/" className={css.logo}>
                        <Image src={logo} width={124} height={25} priority alt="logo" />
                    </Link>

                    <Language />
                </div>
            </div>
        </header>
    );
};
