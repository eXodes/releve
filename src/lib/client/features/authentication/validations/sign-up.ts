import { AuthService } from "$features/authentication/services";

import validator from "validator";
import { create, enforce, include, only, skipWhen, test } from "vest";

export type SignUpPayload = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

enforce.extend({
    isEmail: validator.isEmail,
    isStrongPassword: (value) => {
        return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        });
    },
});

export const signUpSuite = create(
    ({ displayName, email, password, confirmPassword }: SignUpPayload, field?: string) => {
        only(field);
        include("confirm-password").when(
            (draft) => !!password && !!confirmPassword && !draft.hasErrors("password")
        );

        test("email", "Email is required.", () => {
            enforce(email).isNotBlank();
        });

        test("email", "Email .", () => {
            enforce(email).isEmail();
        });

        skipWhen(
            (res) => res.hasErrors("email"),
            () => {
                test.memo(
                    "email",
                    async () => {
                        return await AuthService.isEmailRegistered(email as string);
                    },
                    [email]
                );
            }
        );

        test("display-name", "Display name is required.", () => {
            enforce(displayName).isNotBlank();
        });

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
