import Image from 'next/image';

import s from './avatar.module.scss';

type Props = {
    src: string;
    alt: string;
    size?: number;
};

export const Avatar = ({ src, alt, size }: Props): React.JSX.Element => (
    <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        className={s.avatar}
    />
);
