export type SignUpValues = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    termsAccepted: boolean;
};

export type RegistrationResponse = {
    email: string;
};
