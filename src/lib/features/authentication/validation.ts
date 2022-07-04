import { create, test, enforce, only, include, skipWhen, group } from "vest";
import validator from "validator";

import { AuthService } from "$features/authentication/services";

export interface ValidationType {
    [key: string]: string | boolean | number | object;
    type: string;
}

export interface SignUpDto extends ValidationType {
    type: "sign-up";
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInDto extends ValidationType {
    type: "sign-in";
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface ForgotPasswordDto extends ValidationType {
    type: "forgot-password";
    email: string;
}

export interface ResetPasswordDto extends ValidationType {
    type: "reset-password";
    password: string;
    confirmPassword: string;
}

type Validation = SignUpDto | SignInDto | ForgotPasswordDto | ResetPasswordDto;

const suite = create(
    ({ type, displayName, email, password, confirmPassword }: Validation, field) => {
        enforce.extend({
            isEmail: validator.isEmail,
            isStrongPassword: validator.isStrongPassword,
        });

        only(field);
        only.group(type);
        confirmPassword && include("confirm-password").when("password");

        group("sign-up", () => {
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
                        "The email address is already in use by another account.",
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

            skipWhen(!confirmPassword, () => {
                test("confirm-password", "Password and confirm password mismatch.", () => {
                    enforce(confirmPassword).equals(password);
                });
            });
        });

        group("sign-in", () => {
            test("email", "Email is required.", () => {
                enforce(email).isNotBlank();
            });

            test("password", "Password is required.", () => {
                enforce(password).isNotBlank();
            });
        });

        group("forgot-password", () => {
            test("email", "Email is required.", () => {
                enforce(email).isNotBlank();
            });
        });

        group("reset-password", () => {
            test("password", "Password is required.", () => {
                enforce(password).isNotBlank();
            });

            test("confirm-password", "Confirm password  is required", () => {
                enforce(confirmPassword).isNotBlank();
            });

            skipWhen(!confirmPassword, () => {
                test("confirm-password", "Password and confirm password mismatch.", () => {
                    enforce(confirmPassword).equals(password);
                });
            });
        });
    }
);

export default suite;
