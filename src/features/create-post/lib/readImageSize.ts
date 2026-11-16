type ImageSize = {
    width: number;
    height: number;
};

// Узнаёт ширину и высоту фото в пикселях: браузер загружает файл в <img>
// и сообщает размеры. Если файл повреждён и не открывается, будет ошибка
export const readImageSize = (file: File): Promise<ImageSize> =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            resolve({ width: image.naturalWidth, height: image.naturalHeight });
            URL.revokeObjectURL(url);
        };

        image.onerror = () => {
            reject(new Error('Failed to read the photo'));
            URL.revokeObjectURL(url);
        };

        image.src = url;
    });
