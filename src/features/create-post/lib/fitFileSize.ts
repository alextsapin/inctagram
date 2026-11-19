// Каждый шаг уменьшает фото на 5% по ширине и высоте
const SCALE_STEP = 0.95;
// Меньше половины исходного размера не уменьшаем: такое фото уже заметно хуже
const MIN_SCALE = 0.5;
// Качество JPEG как при обрезке (getCroppedImage). Для PNG не используется
const JPEG_QUALITY = 0.9;

// Фото не удалось уменьшить до лимита. Отдельный класс ошибки, чтобы окно
// отличило её от других и показало текст про размер фото
export class PhotoTooLargeError extends Error {
    constructor() {
        super('Photo is too large');
        this.name = 'PhotoTooLargeError';
    }
}

// Сохраняет canvas в файл того же формата
const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => (blob ? resolve(blob) : reject(new Error('Failed to resize photo'))),
            type,
            JPEG_QUALITY,
        );
    });

// Если файл не меньше лимита бэкенда, уменьшает фото в пикселях шагами по 5%,
// пока файл не станет меньше лимита. Формат (PNG или JPEG) и прозрачность сохраняются.
// Файл меньше лимита возвращает как есть
export const fitFileSize = async (file: Blob, maxBytes: number): Promise<Blob> => {
    if (file.size < maxBytes) return file;

    const url = URL.createObjectURL(file);

    try {
        const image = new Image();

        image.src = url;
        await image.decode();

        for (let scale = SCALE_STEP; scale >= MIN_SCALE; scale *= SCALE_STEP) {
            const canvas = document.createElement('canvas');

            canvas.width = Math.round(image.naturalWidth * scale);
            canvas.height = Math.round(image.naturalHeight * scale);

            const context = canvas.getContext('2d');

            if (!context) throw new Error('Canvas is not supported');

            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Шаги идут по очереди: следующий нужен, только если этот не влез в лимит
            // eslint-disable-next-line no-await-in-loop
            const resized = await canvasToBlob(canvas, file.type);

            if (resized.size < maxBytes) return resized;
        }
    } finally {
        URL.revokeObjectURL(url);
    }

    // Даже вдвое меньшее фото не влезло в лимит: ошибку покажет окно
    throw new PhotoTooLargeError();
};
