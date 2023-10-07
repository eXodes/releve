import validator from "validator";
import { create, enforce, only, test } from "vest";

export type ForgotPasswordPayload = {
    email: string;
};

enforce.extend({
    isEmail: validator.isEmail,
});

const forgotPasswordSuite = create(({ email }: ForgotPasswordPayload, field?: string) => {
    only(field);

    test("email", "Email is required.", () => {
        enforce(email).isNotBlank();
    });

    test("email", "Email must be a valid email.", () => {
        enforce(email).isEmail();
    });
});

export default forgotPasswordSuite;
