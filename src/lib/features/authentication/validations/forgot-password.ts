import { create, test, enforce, only } from "vest";
import validator from "validator";

export interface ForgotPasswordDto {
    email: string;
}

enforce.extend({
    isEmail: validator.isEmail,
});

const suite = create(({ email }: ForgotPasswordDto, field?: string) => {
    only(field);

    test("email", "Email is required.", () => {
        enforce(email).isNotBlank();
    });

    test("email", "Email must be a valid email.", () => {
        enforce(email).isEmail();
    });
});

export default suite;
