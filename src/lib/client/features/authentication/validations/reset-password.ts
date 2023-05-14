import validator from "validator";
import { create, enforce, include, only, test } from "vest";

export interface ResetPasswordPayload {
    password: string;
    confirmPassword: string;
}

enforce.extend({
    isStrongPassword: validator.isStrongPassword,
});

const suite = create(({ password, confirmPassword }: ResetPasswordPayload, field?: string) => {
    only(field);
    confirmPassword && include("confirm-password").when("password");

    test("password", "Password is required.", () => {
        enforce(password).isNotBlank();
    });

    test(
        "password",
        "Password must contain at least one number, one lowercase and one uppercase letter, and at least 8 or more characters.",
        () => {
            enforce(password).isStrongPassword();
        }
    );

    test("confirm-password", "Confirm password  is required", () => {
        enforce(confirmPassword).isNotBlank();
    });

    test("confirm-password", "Password and confirm password mismatch.", () => {
        enforce(confirmPassword).equals(password);
    });
});

export default suite;
