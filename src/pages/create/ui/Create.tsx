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

    // !user здесь нужен TypeScript: после проверок выше пользователь точно есть
    if (isPending || isGuest || !user) {
        return null;
    }

    // После публикации, Save draft и Discard ведём в профиль автора
    const handleGoToProfile = (): void => {
        router.push(`/profile/${user.username}`);
    };

    const createPostWindow = (
        <CreatePostWindow
            userId={user.userId}
            username={user.username}
            onClose={handleClose}
            onGoToProfile={handleGoToProfile}
        />
    );

    return isModal ? (
        createPostWindow
    ) : (
        <ProfileLayout withSidebar>{createPostWindow}</ProfileLayout>
    );
};
