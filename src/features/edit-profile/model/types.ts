// Значения формы General Information
export type EditProfileValues = {
    username: string;
    firstName: string;
    lastName: string;
    // undefined — дата ещё не выбрана: поле необязательное
    dateOfBirth?: Date;
    country: string;
    city: string;
    aboutMe: string;
};
