import type { MessageResponse } from "$client/types/response";
import { PasswordResetLinkEmail } from "$module/auth/actions/email";
import { AuthService } from "$module/auth/auth.service";
import { forgotPasswordSchema } from "$module/auth/validation/forgot-password.schema";
import { validate } from "$server/utils/validation";
import { getFormData } from "$client/utils/data";
import type { ValidationError } from "$client/types/error";

import { type ActionFailure, fail } from "@sveltejs/kit";
import { AuthErrorCodes } from "firebase/auth";
import type { Actions } from "./$types";

export type ForgotPasswordPayload = {
    email: string;
};

export const actions: Actions = {
    default: async ({ request }): Promise<MessageResponse | ActionFailure<ValidationError>> => {
        const formData = await request.formData();

        const payload = getFormData<ForgotPasswordPayload>(formData);

        const errors = validate(forgotPasswordSchema, payload);

        if (errors) {
            return fail(400, errors);
        }

        try {
            const user = await AuthService.whereEmail(payload.email);

            await user.sendEmail(new PasswordResetLinkEmail(user));

            return {
                message: "Successfully sent password reset link.",
            };
        } catch (error) {
            if (
                error instanceof Error &&
                "code" in error &&
                error.code === AuthErrorCodes.USER_DELETED
            ) {
                return {
                    message: "Successfully sent password reset link.",
                };
            }

            throw error;
        }
    },
};
