const ALLOWED_SPECIAL_CHARACTERS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

export const validatePassword = (value: string): true | string => {
    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        return 'Password must contain uppercase and lowercase letters and a number';
    }

    const hasInvalidCharacter = [...value].some(
        char => !/[A-Za-z0-9]/.test(char) && !ALLOWED_SPECIAL_CHARACTERS.includes(char),
    );

    if (hasInvalidCharacter) {
        return 'Password contains unsupported characters';
    }

    return true;
};
