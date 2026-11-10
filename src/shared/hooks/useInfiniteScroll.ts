import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react';

type UseInfiniteScrollOptions = {
    // Вызывается, когда sentinel-элемент (элемент в конце списка) попадает в зону видимости.
    // Функция должна быть мемоизирована на стороне вызывающего компонента (useCallback):
    // иначе useEffect будет пересоздавать IntersectionObserver на каждый рендер родителя.
    onLoadMore: () => void;

    // Идёт ли сейчас загрузка следующей страницы. true защищает от повторного срабатывания,
    // пока вызывающий компонент не передаст обновлённое значение обратно в хук.
    isLoading?: boolean;

    // Есть ли ещё данные для подгрузки. Когда false — подгрузка не запускается.
    hasMore?: boolean;

    // Контейнер со своей полосой прокрутки (overflow).
    // null — скроллится весь viewport браузера, observer смотрит на окно (обычный скролл страницы).
    // Переданный элемент — observer смотрит на видимость внутри этого контейнера,
    // например для списка комментариев со своим скроллом внутри поста.
    root?: Element | null;

    // Отступ от краёв зоны видимости, на котором начинается подгрузка. По умолчанию '200px' —
    // чтобы подгрузка стартовала заранее, до того как пользователь упрётся в низ списка.
    rootMargin?: string;
};

// Хук бесконечного скролла на базе IntersectionObserver.
// Возвращает колбэк-реф для sentinel-элемента, который ставится в конец списка.
// Когда этот элемент попадает в зону видимости — вызывается onLoadMore.
// Колбэк-реф (а не объектный useRef) нужен, чтобы появление/исчезновение DOM-узла
// перезапускало useEffect и observer прикреплялся даже к sentinel, смонтированному позже.
// Использование со стороны компонента не меняется: тот же <div ref={sentinelRef}>.
export const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>(
    options: UseInfiniteScrollOptions,
): RefCallback<T> => {
    const {
        onLoadMore,
        isLoading = false,
        hasMore = true,
        root = null,
        rootMargin = '200px',
    } = options;

    // Sentinel-элемент в конце списка, за которым следит observer. Храним в state:
    // колбэк-реф сообщает о реальном появлении/уходе узла, и это становится зависимостью эффекта.
    const [sentinelNode, setSentinelNode] = useState<T | null>(null);
    const sentinelRef = useCallback((node: T | null) => {
        setSentinelNode(node);
    }, []);

    // Флаг защиты от повторного срабатывания (race condition): взводится сразу при вызове
    // onLoadMore и сбрасывается, только когда входной isLoading становится false.
    // useRef, а не useState — не нужен лишний ре-рендер.
    const isLoadingRef = useRef(false);

    // Синхронизируем флаг с входным isLoading в обе стороны: если загрузка уже идёт
    // при монтировании (isLoading изначально true), ref сразу это учитывает
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        if (!sentinelNode) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                const entry = entries[0];

                if (!entry.isIntersecting) return;

                // Уже загружаем или данных больше нет — не срабатываем повторно
                if (isLoadingRef.current || !hasMore) return;

                isLoadingRef.current = true;
                onLoadMore();
            },
            { root, rootMargin, threshold: 0 },
        );

        observer.observe(sentinelNode);

        // Отключаем observer при размонтировании или смене зависимостей — без утечек
        return () => {
            observer.disconnect();
        };
    }, [sentinelNode, onLoadMore, root, rootMargin, hasMore]);

    return sentinelRef;
};
