import Image from 'next/image';
import Link from 'next/link';

import confirmEmailImage from '../assets/confirm-email.png';

import css from './confirm-email.module.scss';

export const ConfirmEmail = (): React.JSX.Element => {
    return (
        <main className="container">
            <div className={css.root}>
                <h1 className={css.title}>Congratulations!</h1>
                <p className={css.text}>Your email has been confirmed</p>

                <Link className={css.link} href="/sign-in">
                    Sign In
                </Link>

                <Image
                    className={css.image}
                    src={confirmEmailImage}
                    alt="Email successfully confirmed"
                />
            </div>
        </main>
    );
};
