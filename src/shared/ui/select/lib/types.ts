export type SelectOption = {
    value: string; // что придёт в onChange и уйдёт на сервер
    label: string; // что видит пользователь
    icon?: React.ReactNode; // картинка слева от текста, например флаг языка
};
