import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactCompiler: true,
    devIndicators: false,
    images: {
        // next/image показывает внешние картинки только с разрешённых адресов.
        // Картинки постов и аватарки бэкенд отдаёт ссылками на Yandex Object Storage.
        // Домен у всех бакетов Яндекса общий, поэтому разрешаем только наш бакет.
        remotePatterns: [
            new URL('https://storage.yandexcloud.net/blackdragonsinctagram/**'),
        ],
    },
};

export default nextConfig;
