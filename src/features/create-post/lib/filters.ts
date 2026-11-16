import { createFilter } from 'cc-gram';

// Один экземпляр библиотеки на всё окно создания поста.
// init: false — библиотека сама не ищет картинки на странице: стиль фильтра ставим мы
export const ccgram = createFilter({ init: false });

// Список плиток: сначала Normal (null — без фильтра, в cc-gram такой нет), потом фильтры библиотеки.
// По ТЗ список зависит от библиотеки, поэтому названия берём из неё, а не пишем сами
export const FILTER_NAMES: (string | null)[] = [null, ...ccgram.filterNames];

// Подпись под плиткой: clarendon → Clarendon, null → Normal
export const getFilterLabel = (filter: string | null): string =>
    filter === null ? 'Normal' : filter.charAt(0).toUpperCase() + filter.slice(1);

// CSS для показа фильтра на экране, например «contrast(1.2) saturate(1.35)».
// Без фильтра — none, фото как есть
export const getFilterStyle = (filter: string | null): string =>
    filter === null ? 'none' : ccgram.getFilterStyle(filter);
