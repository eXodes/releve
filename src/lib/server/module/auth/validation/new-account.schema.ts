import type { SignUpPayload } from "$features/authentication/validations/sign-up";

import Joi from "joi";

export const signUpSchema = Joi.object<SignUpPayload>({
    displayName: Joi.string().required().messages({
        "string.empty": "Display name is required.",
        "string.base": "Display name must be a string.",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Email must be a valid email address.",
    }),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"))
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.pattern.base":
                "Password must contain at least one number, one lowercase and one uppercase letter, and at least 8 or more characters.",
        }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
        "any.only": "Password and confirm password mismatch.",
    }),
});
