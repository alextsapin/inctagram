import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react';

type UseInfiniteScrollOptions = {
    // Вызывается, когда sentinel-элемент (элемент в конце списка) попадает в зону видимости.
    // Функция должна быть мемоизирована на стороне вызывающего компонента (useCallback):
    // иначе useEffect будет пересоздавать IntersectionObserver на каждый рендер родителя.
    // Функция должна возвращать Promise, который resolve/reject-ится по завершении загрузки:
    // именно на основании этого Promise хук снимает внутреннюю блокировку от повторных
    // вызовов, а не на основании внешнего isLoading.
    onLoadMore: () => Promise<unknown>;

    // Идёт ли сейчас загрузка следующей страницы. true участвует в guard-проверке как
    // дополнительная защита на случай, когда внешнее состояние уже сигналит «идёт загрузка»
    // до того, как успела взвестись внутренняя защёлка (например, во время самой первой
    // загрузки страницы). Поле обязательно.
    //
    // Важно: единственным источником снятия внутренней блокировки является .finally() у
    // Promise, который возвращает onLoadMore, — НЕ синхронизация с этим isLoading через
    // рендер или эффект. Поэтому isLoading не обязан проходить false→true→false на каждом
    // запросе: даже при мгновенном резолве Promise хук корректно снимет защёлку.
    isLoading: boolean;

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
        isLoading,
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
    // onLoadMore и сбрасывается в .finally() у возвращаемого Promise.
    // useRef, а не useState — не нужен лишний ре-рендер.
    const isLoadingRef = useRef(false);

    useEffect(() => {
        if (!sentinelNode) return;

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                const entry = entries[0];

                if (!entry.isIntersecting) return;

                // Уже загружаем, загрузка идёт или данных больше нет — не срабатываем повторно.
                // isLoading в guard защищает от повторного onLoadMore при пересоздании эффекта
                // во время уже идущего запроса (ref в этот момент может быть ещё false).
                if (isLoadingRef.current || isLoading || !hasMore) return;

                isLoadingRef.current = true;

                // Цепочка без void: правило no-void (airbnb) запрещает оператор void.
                // unhandled rejection не возникает, т.к. .catch() поглощает ошибку —
                // её отображает вызывающий компонент через isError/isFetchNextPageError.
                Promise.resolve()
                    .then(onLoadMore)
                    .catch(() => {
                        // Ошибку отображает вызывающий компонент (через isError/
                        // isFetchNextPageError из useInfiniteQuery), здесь её
                        // достаточно проглотить, чтобы не было unhandled rejection.
                    })
                    .finally(() => {
                        isLoadingRef.current = false;
                    });
            },
            { root, rootMargin, threshold: 0 },
        );

        observer.observe(sentinelNode);

        // Отключаем observer при размонтировании или смене зависимостей — без утечек
        return () => {
            observer.disconnect();
        };
    }, [sentinelNode, onLoadMore, root, rootMargin, hasMore, isLoading]);

    return sentinelRef;
};
