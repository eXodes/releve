import { create, test, enforce, only } from "vest";
import validator from "validator";

export interface SignInDto {
    email: string;
    password: string;
    rememberMe: boolean;
}

enforce.extend({
    isEmail: validator.isEmail,
});

const suite = create(({ email, password }: SignInDto, field?: string) => {
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

export default suite;
