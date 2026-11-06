// Проверяет, что текст — одна и та же буква, набранная несколько раз подряд.
// 'kkk' → true, 'k' → true, 'ky' → false
export const isSameLetterRepeated = (text: string): boolean => {
    const firstLetter = text.charAt(0);
    const letters = text.split('');

    return letters.every(letter => letter === firstLetter);
};
