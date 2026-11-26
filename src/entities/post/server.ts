// Публичный API слайса для серверного кода. Отдельно от index.ts: index.ts
// подключает клиентские компоненты, а серверный код не должен попасть в браузер
export { getPostOnServer, getUserPostsPageOnServer } from './api/postApi.server';
