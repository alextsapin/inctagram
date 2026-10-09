import Image from 'next/image';
import Link from 'next/link';

import logo from '@/widgets/header/assets/logo.svg';
import styles from '@/widgets/header/ui/header.module.scss';

export const Header = (): React.JSX.Element => {
    return (
        <header className={styles.header}>
            <div className="container">
                <Link href="/">
                    <Image src={logo} alt="Inctagram" width={124} height={25} priority />
                </Link>
            </div>
        </header>
    );
};
