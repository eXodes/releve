import type { ForgotPasswordPayload } from "$features/authentication/validations/forgot-password";

import Joi from "joi";

export const forgotPasswordSchema = Joi.object<ForgotPasswordPayload>({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Email must be a valid email address.",
    }),
});
