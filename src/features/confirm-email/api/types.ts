export type RegistrationResponse = {
    email: string;
};

export type ResendVerificationRequest = {
    email: string;
    recaptchaToken: string;
};
