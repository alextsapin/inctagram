// Публичный API слайса для серверного кода. Отдельно от index.ts: index.ts
// подключает клиентские хуки, а серверный код не должен попасть в браузер
export { getProfileOnServer } from './api/profileApi.server';
