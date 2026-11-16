'use client';

import type { ReactNode } from 'react';

import { useCurrentUser } from '@/entities/session';
import { ProfileLayout } from '@/widgets/profile-layout';

import style from './main.module.scss';

type Props = {
    children: ReactNode;
};

export const MainClientLayout = ({ children }: Props): React.JSX.Element => {
    const { data: user, isError } = useCurrentUser();

    const isAuthed = Boolean(user) && !isError;

    if (!isAuthed) {
        return <main className={style.main}>{children}</main>;
    }

    return (
        <ProfileLayout withSidebar>
            <div className={style.main}>{children}</div>
        </ProfileLayout>
    );
};
