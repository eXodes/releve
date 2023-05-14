import validator from "validator";
import { create, enforce, only, test } from "vest";

export type SignInPayload = {
    email: string;
    password: string;
    rememberMe?: boolean;
};

enforce.extend({
    isEmail: validator.isEmail,
});

export const signInSuite = create(({ email, password }: SignInPayload, field?: string) => {
    only(field);

    test("email", "Email is required.", () => {
        enforce(email).isNotBlank();
    });

    test("email", "Email must be a valid email.", () => {
        enforce(email).isEmail();
    });

    test("password", "Password is required.", () => {
        enforce(password).isNotBlank();
    });
});
