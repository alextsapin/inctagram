'use client';

import type { JSX } from 'react';

import Link from 'next/link';

import { useCurrentUser } from '@/entities/session';
import { ProfilePage } from '@/widgets/profile';
import myProfileCss from '@/pages/my-profile/ui/my-profile.module.scss';
import { Button } from '@/shared/ui/button';

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

    return (
        <ProfilePage
            username={username}
            withSidebar={isAuthed}
            actions={
                isMyProfile ? (
                    <Link href="/profile/settings" className={myProfileCss['settings-link']}>
                        Profile Settings
                    </Link>
                ) : isAuthed ? (
                    <>
                        <Button onClick={handleFollow}>Follow</Button>
                        <Button variant="secondary" onClick={handleSendMessage}>
                            Send Message
                        </Button>
                    </>
                ) : undefined
            }
        />
    );
};
