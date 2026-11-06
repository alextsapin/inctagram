// Токен храним в обычной переменной (в памяти), а не в localStorage:
// так его не сможет украсть чужой скрипт на странице.
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
    accessToken = token;
};
