# PhotoCropper

Фото под рамкой обрезки. Пользователь двигает фото мышью, пальцем или стрелками и приближает колесом мыши или двумя пальцами, до 3 раз.

## Назначение

Компонент нужен везде, где пользователь выбирает часть фото: аватар в настройках профиля и фото поста при создании. Внутри работает библиотека `react-easy-crop`.

Компонент управляемый: сдвиг (`crop`) и приближение (`zoom`) хранит родитель, а компонент только сообщает новые значения. Так они не теряются, когда компонент пропадает с экрана, например при переключении фото в галерее или возврате на шаг обрезки.

Сам компонент ничего не вырезает. Он сообщает, какую область выбрал пользователь, а файл из этой области делает `getCroppedImage` из `@/shared/lib`.

## Импорт

```tsx
import { PhotoCropper } from '@/shared/ui/photo-cropper';
```

## Свойства (Props)

| Prop             | Тип                      | По умолчанию | Назначение                                                                  |
| ---------------- | ------------------------ | ------------ | --------------------------------------------------------------------------- |
| `image`          | `string`                 | —            | Ссылка на фото, например из `URL.createObjectURL`. Обязательный             |
| `crop`           | `Point`                  | —            | Сдвиг фото `{ x, y }`. Обязательный                                         |
| `zoom`           | `number`                 | —            | Приближение, от 1 до 3. Обязательный                                        |
| `onCropChange`   | `(crop: Point) => void`  | —            | Пользователь сдвинул фото. Обязательный                                     |
| `onZoomChange`   | `(zoom: number) => void` | —            | Пользователь приблизил или отдалил фото. Обязательный                       |
| `onCropComplete` | `(area: Area) => void`   | —            | Пользователь отпустил фото: выбранная область в пикселях. Обязательный      |
| `aspect`         | `number`                 | `1`          | Пропорции рамки: `1` квадрат, `4 / 5` вертикальная, `16 / 9` горизонтальная |
| `cropShape`      | `'rect' \| 'round'`      | `'rect'`     | Форма рамки: прямоугольник или круг                                         |
| `objectFit`      | `'cover' \| 'contain'`   | `'cover'`    | Как фото встаёт в область: растянуто на всю область или целиком             |
| `className`      | `string`                 | —            | Класс с размерами области: их задаёт родитель                               |

Типы `Point` и `Area` берём из библиотеки: `import type { Area, Point } from 'react-easy-crop';`.

## Размеры области

У компонента нет своих размеров: ширину и высоту задаёт родитель через `className`. Если их не задать, область будет нулевой высоты и фото не будет видно.

```scss
.cropper {
    width: 100%;
    max-width: 332px;
    aspect-ratio: 332 / 340;
}
```

## Пример: аватар под кругом

```tsx
import { useState } from 'react';
import type { Area, Point } from 'react-easy-crop';

import { getCroppedImage } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { PhotoCropper } from '@/shared/ui/photo-cropper';

import css from './avatar-cropper.module.scss';

export const AvatarCropper = ({ photoUrl, type }: { photoUrl: string; type: string }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [area, setArea] = useState<Area | null>(null);

    const handleSave = async (): Promise<void> => {
        if (!area) return;

        const avatar = await getCroppedImage(photoUrl, area, type);
        // дальше отправляем avatar на сервер
    };

    return (
        <>
            <PhotoCropper
                image={photoUrl}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={setArea}
                cropShape="round"
                className={css.cropper}
            />
            <Button onClick={handleSave}>Save</Button>
        </>
    );
};
```

## Пример: фото поста с пропорциями 4:5

```tsx
<PhotoCropper
    image={photoUrl}
    crop={crop}
    zoom={zoom}
    onCropChange={setCrop}
    onZoomChange={setZoom}
    onCropComplete={setArea}
    aspect={4 / 5}
    objectFit="contain"
    className={css.cropper}
/>
```

`objectFit="contain"` нужен, когда пропорции рамки бывают любыми. С `cover` фото растягивается по области, а не по рамке, и широкая рамка на широком фото захватывает только середину. С `contain` при зуме 1 в рамку попадает максимум фото.

Если фото несколько, у каждого свои `crop`, `zoom` и область: храним их в состоянии родителя отдельно для каждого фото.

## Где используется

-   `features/change-profile-photo`: окно «Add a Profile Photo», круг 1:1.
-   `features/create-post`: шаг Cropping при создании поста.
