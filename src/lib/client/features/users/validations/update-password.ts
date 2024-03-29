import validator from "validator";
import { create, enforce, include, only, test } from "vest";

export type UpdatePasswordPayload = {
    password: string;
    confirmPassword: string;
};

export type UpdatePasswordResponse = {
    success: boolean;
};

enforce.extend({
    isEmail: validator.isEmail,
    isStrongPassword: validator.isStrongPassword,
});

const updatePasswordSuite = create(
    ({ password, confirmPassword }: UpdatePasswordPayload, field) => {
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
    }
);

export default updatePasswordSuite;
