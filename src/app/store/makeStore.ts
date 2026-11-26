import { combineReducers, configureStore, type EnhancedStore } from '@reduxjs/toolkit';

import { successAlertReducer } from '@/shared/ui/success-alert';

// Все слайсы приложения. Новый слайс добавляем сюда
const rootReducer = combineReducers({
    successAlert: successAlertReducer,
});

type RootState = ReturnType<typeof rootReducer>;

// Функция, а не готовый стор: каждый вызов создаёт новый пустой стор.
// Стор на уровне файла был бы на сервере один на всех посетителей,
// и состояние одного попадало бы в страницу другого
export const makeStore = (): EnhancedStore<RootState> =>
    configureStore({ reducer: rootReducer });
