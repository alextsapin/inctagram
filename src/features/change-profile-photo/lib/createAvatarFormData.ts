// Ключ поля подтверждён бэкендом 24.11. Content-Type вручную не ставим:
// для FormData его задаёт axios
const AVATAR_FIELD_NAME = 'avatar';

// Имя файла в запросе: сервер ждёт файл с именем, а не безымянные данные
const getFileName = (file: Blob): string => {
    const extension = file.type === 'image/png' ? 'png' : 'jpg';

    return `avatar.${extension}`;
};

// Собирает FormData для загрузки аватара. Пока не используется: путь ручки
// ещё не финальный, сетевой вызов появится в этапе Б
export const createAvatarFormData = (photo: Blob): FormData => {
    const formData = new FormData();

    formData.append(AVATAR_FIELD_NAME, photo, getFileName(photo));

    return formData;
};
