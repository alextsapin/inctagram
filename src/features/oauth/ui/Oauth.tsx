import Image from 'next/image';

import github from '../assets/github.svg';
import google from '../assets/google.svg';

import css from './oauth.module.scss';

export const Oauth = (): React.JSX.Element => {
    return (
        <div className={css.buttons}>
            <button
                type="button"
                className={css.button}
                aria-label="Continue with Google"
            >
                <Image src={google} alt="" width={36} height={36} />
            </button>
            <button
                type="button"
                className={css.button}
                aria-label="Continue with GitHub"
            >
                <Image src={github} alt="" width={36} height={36} />
            </button>
        </div>
    );
};
