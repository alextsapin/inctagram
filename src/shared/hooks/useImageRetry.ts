import { useEffect, useRef, useState } from 'react';

// Первая пауза перед повтором. Каждая следующая на столько же длиннее: 3, 6, 9 секунд...
const FIRST_DELAY_MS = 3000;
// Дольше 30 секунд между попытками не ждём
const MAX_DELAY_MS = 30000;
// Через 10 минут после первой ошибки перестаём пробовать.
// Столько нужно, пока бэкенд грузит фото медленно: 3 фото у него заняли 2 минуты 21 секунду
const MAX_WAIT_MS = 600000;

type ImageRetry = {
    attempt: number; // номер попытки: его добавляют в key картинки, чтобы браузер загрузил её заново
    isLoaded: boolean; // картинка загрузилась
    isWaiting: boolean; // была ошибка, ждём паузу перед следующей попыткой
    isGivenUp: boolean; // 10 минут прошли, больше не пробуем
    handleLoad: () => void; // передать в onLoad картинки
    handleError: () => void; // передать в onError картинки
};

// Повторная загрузка картинки, которой пока нет на сервере.
// Бэкенд загружает фото поста в хранилище в фоне: сразу после публикации ссылка
// отвечает 404, а через какое-то время начинает работать. Поэтому после ошибки ждём
// паузу и пробуем ещё раз. Хук только считает попытки, картинку рисует компонент
export const useImageRetry = (): ImageRetry => {
    const [attempt, setAttempt] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isGivenUp, setIsGivenUp] = useState(false);
    // Время первой ошибки. В ref, а не в state: от него ничего не рисуется
    const firstErrorAt = useRef<number | null>(null);

    useEffect(() => {
        if (!isWaiting) return;

        const delay = Math.min(FIRST_DELAY_MS * (attempt + 1), MAX_DELAY_MS);

        const timer = setTimeout(() => {
            setIsWaiting(false);
            setAttempt(prev => prev + 1);
        }, delay);

        // Если картинка исчезла с экрана раньше, чем прошла пауза, повтор не нужен
        return (): void => clearTimeout(timer);
    }, [isWaiting, attempt]);

    const handleLoad = (): void => {
        setIsLoaded(true);
    };

    const handleError = (): void => {
        if (firstErrorAt.current === null) {
            firstErrorAt.current = Date.now();
        }

        if (Date.now() - firstErrorAt.current >= MAX_WAIT_MS) {
            setIsGivenUp(true);

            return;
        }

        setIsWaiting(true);
    };

    return { attempt, isLoaded, isWaiting, isGivenUp, handleLoad, handleError };
};
