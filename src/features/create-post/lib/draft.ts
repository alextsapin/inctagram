import type { PostDraft } from '../model/types';

const DB_NAME = 'inctagram-drafts';
const STORE_NAME = 'post-drafts';
const DB_VERSION = 1;

const openDraftDb = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB is not available in this environment'));

            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // Убрали keyPath, чтобы не пихать userId в объект PostDraft
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

export const saveDraft = async (userId: string, draft: PostDraft): Promise<void> => {
    const db = await openDraftDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        // Передаем userId как ключ, а draft - как значение
        store.put(draft, userId);

        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
};

export const getDraft = async (userId: string): Promise<PostDraft | null> => {
    const db = await openDraftDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(userId);

        request.onsuccess = () => {
            db.close();
            // Теперь здесь чистый PostDraft без лишних полей
            resolve((request.result as PostDraft | undefined) ?? null);
        };
        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
};

export const deleteDraft = async (userId: string): Promise<void> => {
    const db = await openDraftDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        store.delete(userId);

        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
};
