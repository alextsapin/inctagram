import type { ReactNode } from 'react';

import { Sidebar } from '@/widgets/sidebar';

import css from './profile-layout.module.scss';

type ProfileLayoutProps = {
    children: ReactNode;
    withSidebar?: boolean;
};

export const ProfileLayout = ({
    children,
    withSidebar = false,
}: ProfileLayoutProps): React.JSX.Element => {
    return (
        <div className={css.layout}>
            {withSidebar && <Sidebar />}
            <main className={css.main}>{children}</main>
        </div>
    );
};
