import { useEffect, useState } from 'react';

type ObjectUrl = {
    file: Blob; // для какого файла создана ссылка
    url: string;
};

// Временная ссылка на файл, чтобы показать его как картинку. Создаём её в эффекте:
// так браузер освобождает память, когда файл меняется или компонент пропадает с экрана.
// Пока ссылки нет (первый рендер или файл только что сменился), возвращает null.
// Ссылку на старый файл не отдаём: иначе после смены файла один рендер показал бы старое фото
export const useObjectUrl = (file: Blob): string | null => {
    const [objectUrl, setObjectUrl] = useState<ObjectUrl | null>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);

        setObjectUrl({ file, url });

        return () => URL.revokeObjectURL(url);
    }, [file]);

    return objectUrl?.file === file ? objectUrl.url : null;
};
