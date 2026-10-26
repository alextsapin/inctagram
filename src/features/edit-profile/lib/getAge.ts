// Сколько полных лет человеку на дату today (по умолчанию — сегодня)
export const getAge = (birthDate: Date, today: Date = new Date()): number => {
    const age = today.getFullYear() - birthDate.getFullYear();

    // Если день рождения в этом году ещё не наступил, полных лет на один меньше
    const isBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

    return isBirthdayPassed ? age : age - 1;
};
