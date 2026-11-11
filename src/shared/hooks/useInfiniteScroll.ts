import { useCallback, useEffect, useRef, useState, type RefCallback } from 'react';

type UseInfiniteScrollOptions = {
    // Вызывается, когда sentinel-элемент (элемент в конце списка) попадает в зону видимости.
    // Функция должна быть мемоизирована на стороне вызывающего компонента (useCallback):
    // иначе useEffect будет пересоздавать IntersectionObserver на каждый рендер родителя.
    onLoadMore: () => void;

    // Идёт ли сейчас загрузка следующей страницы. true защищает от повторного срабатывания,
    // пока вызывающий компонент не передаст обновлённое значение обратно в хук.
    // Поле обязательно: без внешнего сигнала о завершении загрузки internal-флаг защиты
    // от повторных вызовов не сможет сброситься, и подгрузка молча перестанет работать
    // после первого вызова.
    //
    // Контракт: isLoading должен отражать РЕАЛЬНЫЙ in-flight запрос (не «возможно, грузим»).
    // Гарантия от повторного срабатывания: onLoadMore не вызывается повторно, пока
    // isLoading === true (или пока isLoadingRef не сброшен), и разрешается снова
    // только на ближайшем рендере с isLoading === false. То есть между двумя вызовами
    // onLoadMore всегда есть рендер, на котором isLoading вернулся в false. Если
    // isLoading не отражает фактический in-flight (например, остаётся false, пока запрос
    // в полёте), хук не сможет защититься от параллельных вызовов.
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
    // onLoadMore и сбрасывается, когда входной isLoading становится false.
    // useRef, а не useState — не нужен лишний ре-рендер.
    const isLoadingRef = useRef(false);

    // Сброс защёлки не должен зависеть от ПЕРЕХОДА isLoading: если запрос завершается
    // мгновенно (кэш, очень быстрый ответ), isLoading не успевает пройти false→true→false,
    // и useEffect [isLoading] не перезапускается, оставляя защёлку true навсегда.
    // Поэтому снимаем флаг синхронно на каждом рендере, когда загрузка не идёт.
    // Запись в ref во время рендера безопасна (не вызывает ре-рендер) и отражает
    // текущее значение isLoading как «вычисляемое из пропсов».
    //
    // Идемпотентность: присваивание isLoadingRef.current = false при !isLoading — чистая
    // функция от текущего пропса (не накапливается, не зависит от предыдущих значений),
    // поэтому повторные рендеры не меняют результат. Это тот же «вычисляемый из пропсов»
    // ref, что и useState-производное значение, только без лишнего ре-рендера. НЕ менять
    // обратно на useEffect [isLoading] — тот снова внесёт зависимость от перехода.
    if (!isLoading) {
        isLoadingRef.current = false;
    }

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
                onLoadMore();
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
