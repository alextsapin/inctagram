import type { SelectOption } from '@/shared/ui/select';

// Временный список: в API пока нет справочника стран и городов.
// Когда он появится, эти массивы заменим на запрос через useQuery.
export const COUNTRY_OPTIONS: SelectOption[] = [
    { value: 'belarus', label: 'Belarus' },
    { value: 'kazakhstan', label: 'Kazakhstan' },
    { value: 'russia', label: 'Russia' },
    { value: 'ukraine', label: 'Ukraine' },
];

// Города лежат по ключу страны (value из COUNTRY_OPTIONS)
export const CITY_OPTIONS: Record<string, SelectOption[]> = {
    belarus: [
        { value: 'minsk', label: 'Minsk' },
        { value: 'gomel', label: 'Gomel' },
        { value: 'brest', label: 'Brest' },
    ],
    kazakhstan: [
        { value: 'almaty', label: 'Almaty' },
        { value: 'astana', label: 'Astana' },
    ],
    russia: [
        { value: 'moscow', label: 'Moscow' },
        { value: 'saint-petersburg', label: 'Saint Petersburg' },
        { value: 'kazan', label: 'Kazan' },
    ],
    ukraine: [
        { value: 'kyiv', label: 'Kyiv' },
        { value: 'lviv', label: 'Lviv' },
        { value: 'odesa', label: 'Odesa' },
    ],
};
