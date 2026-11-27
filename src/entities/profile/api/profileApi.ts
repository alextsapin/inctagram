import { isAxiosError } from 'axios';

import { instance } from '@/shared/api';

import type { Profile, UpdateProfileDto, UploadAvatarResponse } from '../model/types';

import { createAvatarFormData } from './createAvatarFormData';

const NOT_FOUND = 404;

// TODO(BLD-165): примерный путь по сообщению бэкенда от 24.11.2026,
// не финал — скорректировать, когда подтвердят
export const AVATAR_UPLOAD_PATH = '/api/v1/avatar';

// Профиль не найден: username не существует. UI должен показать целое состояние
// «такого профиля нет», а не шапку с ошибкой и сетку постов рядом.
export class ProfileNotFoundError extends Error {
    constructor(username: string) {
        super(`Profile with username ${username} not found`);
        this.name = 'ProfileNotFoundError';
    }
}

export const profileApi = {
    // GET /api/v1/{username}/profile (ProfileResponseDto).
    // 404 приходит без JSON-тела (в спеке у него нет content/schema), поэтому
    // «профиля нет» распознаём по HTTP-статусу, а не по телу ответа.
    // Остальные ошибки (400, сетевые, 5xx) пробрасываем как есть.
    async getUserProfile(username: string): Promise<Profile> {
        try {
            const { data } = await instance.get<Profile>(
                `/api/v1/${encodeURIComponent(username)}/profile`,
            );

            return data;
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === NOT_FOUND) {
                throw new ProfileNotFoundError(username);
            }

            throw error;
        }
    },

    // PUT /api/v1/profile (UpdateProfileDto). Access token добавляет
    // interceptor instance, вручную его не передаём.
    // 204 No Content — тело ответа не читаем.
    async updateProfile(dto: UpdateProfileDto): Promise<void> {
        await instance.put('/api/v1/profile', dto);
    },

    // POST AVATAR_UPLOAD_PATH (multipart/form-data, поле avatar).
    // Access token добавляет interceptor instance. Content-Type для FormData
    // axios выставляет сам, вручную его не задаём.
    async uploadAvatar(file: Blob): Promise<UploadAvatarResponse> {
        const { data } = await instance.post<UploadAvatarResponse>(
            AVATAR_UPLOAD_PATH,
            createAvatarFormData(file),
        );

        return data;
    },
};
