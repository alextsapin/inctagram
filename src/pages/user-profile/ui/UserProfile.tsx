'use client';

import type { JSX } from 'react';

import Link from 'next/link';

import { useCurrentUser } from '@/entities/session';
import myProfileCss from '@/pages/my-profile/ui/my-profile.module.scss';
import { Button } from '@/shared/ui/button';
import { ProfilePage } from '@/widgets/profile';

type UserProfileProps = {
    username: string;
};

export const UserProfile = ({ username }: UserProfileProps): JSX.Element => {
    const { data: user, isError } = useCurrentUser();

    const isAuthed = Boolean(user) && !isError;
    const isMyProfile = user?.username === username;

    const handleFollow = (): void => {
        // TODO: заменить на реальный вызов API (endpoint: POST /api/profile/{username}/follow)
    };

    const handleSendMessage = (): void => {
        // TODO: заменить на реальный вызов API (endpoint: POST /api/messenger/{username})
    };

    let actions: React.JSX.Element | undefined;

    if (isMyProfile) {
        actions = (
            <Link href="/profile/settings" className={myProfileCss['settings-link']}>
                Profile Settings
            </Link>
        );
    } else if (isAuthed) {
        actions = (
            <>
                <Button onClick={handleFollow}>Follow</Button>
                <Button variant="secondary" onClick={handleSendMessage}>
                    Send Message
                </Button>
            </>
        );
    }

    return <ProfilePage username={username} withSidebar={isAuthed} actions={actions} />;
};
