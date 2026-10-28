'use client';

import type { JSX } from 'react';

import { useCurrentUser } from '@/entities/session';
import { ProfilePage } from '@/pages/profile';

type UserProfileProps = {
    username: string;
};

export const UserProfile = ({ username }: UserProfileProps): JSX.Element => {
    const { data: user, isError } = useCurrentUser();
    const isAuthed = Boolean(user) && !isError;

    return <ProfilePage username={username} withSidebar={isAuthed} />;
};
