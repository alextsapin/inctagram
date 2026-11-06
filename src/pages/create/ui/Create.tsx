'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/entities/session';
import { CreatePostWindow } from '@/features/create-post';
import { ProfileLayout } from '@/widgets/profile-layout';

type CreateProps = {
    isModal?: boolean;
};

export const Create = ({ isModal }: CreateProps): React.JSX.Element | null => {
    const router = useRouter();
    const { data: user, isPending, isError } = useCurrentUser();
    const isGuest = !isPending && (isError || !user);

    // Создавать посты может только вошедший пользователь
    useEffect(() => {
        if (isGuest) {
            router.replace('/');
        }
    }, [isGuest, router]);

    const handleClose = (): void => {
        // Окно поверх страницы: возвращаемся туда, откуда открыли.
        // Отдельная страница: возвращаться может быть некуда, поэтому ведём на главную
        if (isModal) {
            router.back();
        } else {
            router.push('/');
        }
    };

    if (isPending || isGuest) {
        return null;
    }

    const createPostWindow = <CreatePostWindow onClose={handleClose} />;

    return isModal ? (
        createPostWindow
    ) : (
        <ProfileLayout withSidebar>{createPostWindow}</ProfileLayout>
    );
};
