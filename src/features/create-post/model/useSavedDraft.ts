import { useEffect, useState } from 'react';

import { getDraft } from '../lib/draft';

import type { PostDraft } from './types';

// Ищет сохранённый черновик пользователя, чтобы показать кнопку Open Draft.
// Пока черновик не найден или если его нет, возвращает null
export const useSavedDraft = (userId: string): PostDraft | null => {
    const [draft, setDraft] = useState<PostDraft | null>(null);

    useEffect(() => {
        // Окно могут закрыть раньше, чем IndexedDB ответит. Тогда ответ уже не нужен
        let isActive = true;

        getDraft(userId)
            .then(foundDraft => {
                if (isActive) {
                    setDraft(foundDraft);
                }
            })
            .catch(() => {
                // Черновик не прочитался: просто не показываем кнопку Open Draft
            });

        return () => {
            isActive = false;
        };
    }, [userId]);

    return draft;
};
