import 'server-only';

import { type QueryClient } from '@tanstack/react-query';

import { postQueryKeys } from '@/entities/post';
import { getUserPostsPageOnServer } from '@/entities/post/server';
import { type Profile, profileQueryKeys } from '@/entities/profile';
import { getProfileOnServer } from '@/entities/profile/server';

// Чем закончилась загрузка:
// found — профиль и посты в кэше; not-found — такого профиля нет;
// error — бэкенд не ответил, в кэше ничего нет, данные загрузит браузер
export type PrefetchProfileResult = 'found' | 'not-found' | 'error';

// Пишет в лог сервера, почему не загрузились данные. Страница при ошибке всё равно
// открывается (данные загрузит браузер), поэтому без лога сбой на проде никто
// не заметит. Формат как у логов главной страницы в getMainPageData
const logServerError = (
    what: 'profile' | 'posts',
    username: string,
    error: unknown,
): void => {
    // eslint-disable-next-line no-console
    console.error(`[Profile SSR] ${what} request failed`, {
        username,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: error instanceof Error ? error.message : String(error),
    });
};

// Кладёт в queryClient профиль и первые 8 постов, чтобы страница пришла
// с сервера уже с ними. Ключи те же, что у useProfile и useUserPostsInfinite:
// по ним браузер найдёт данные в кэше и не будет запрашивать их ещё раз
export const prefetchProfileWithPosts = async (
    queryClient: QueryClient,
    username: string,
): Promise<PrefetchProfileResult> => {
    let profile: Profile | null;

    try {
        profile = await getProfileOnServer(username);
    } catch (error) {
        logServerError('profile', username, error);

        return 'error';
    }

    if (!profile) return 'not-found';

    // Кладём профиль сами через setQueryData, а не через queryClient.query: если профиля нет,
    // в кэш не должен попасть null, иначе шапка профиля получит пустые данные
    queryClient.setQueryData(profileQueryKeys.detail(username), profile);

    // Посты запрашиваются по id автора, а не по username.
    // Отдельная константа: внутри queryFn ниже TypeScript уже не помнит,
    // что profile проверен на null, а userId он знает точно
    const userId = profile.uid;

    // Сетка постов работает на useInfiniteQuery и ждёт данные вида
    // { pages, pageParams }, поэтому infiniteQuery, а не обычный query.
    // infiniteQuery выбрасывает ошибку. Дальше её не пробрасываем: если посты
    // не загрузились, их загрузит браузер. Только пишем её в лог сервера
    await queryClient
        .infiniteQuery({
            queryKey: postQueryKeys.userPosts(userId),
            queryFn: () => getUserPostsPageOnServer(userId),
            // Как в useUserPostsInfinite: первая страница без курсора (null),
            // следующие по курсору-строке из nextCursor
            initialPageParam: null as string | null,
        })
        .catch((error: unknown): void => logServerError('posts', username, error));

    return 'found';
};
