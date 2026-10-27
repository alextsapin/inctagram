import type { ReactNode } from 'react';

import css from './profile-layout.module.scss';

type ProfileLayoutProps = {
    children: ReactNode;
};

export const ProfileLayout = ({ children }: ProfileLayoutProps): React.JSX.Element => {
    return <main className={css.main}>{children}</main>;
};
