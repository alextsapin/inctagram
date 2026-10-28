'use client';

import type { JSX } from 'react';

import { useSearchParams } from 'next/navigation';

import { useCurrentUser } from '@/entities/session';
import { ProfilePage } from '@/pages/profile';
import { Button } from '@/shared/ui/button';

type UserProfileProps = {
    username: string;
};

export const UserProfile = ({ username }: UserProfileProps): JSX.Element => {
    const searchParams = useSearchParams();
    const { data: user, isError } = useCurrentUser();

    // TODO: Удалить после подключения реального API.
    // В dev-режиме параметр ?unauth=true эмулирует неавторизованного пользователя.
    const isUnauthMock =
        process.env.NODE_ENV === 'development' && searchParams?.get('unauth') === 'true';

    const isAuthed = !isUnauthMock && Boolean(user) && !isError;

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
                isAuthed ? (
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
