import { validate } from "$server/utils/validation";
import { handleApiError } from "$server/utils/error";
import { AuthService } from "$module/auth/auth.service";
import { PasswordResetLinkEmail } from "$module/auth/actions/email";
import { forgotPasswordSchema } from "$module/auth/validation/forgot-password.schema";

import { getFormData } from "$client/utils/data";
import type { MessageResponse } from "$client/types/response";

import { AuthErrorCodes } from "firebase/auth";

import type { Actions } from "./$types";

export type ForgotPasswordPayload = {
    email: string;
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const payload = getFormData<ForgotPasswordPayload>(formData);

        const errors = validate(forgotPasswordSchema, payload);

        if (errors) {
            throw handleApiError(errors);
        }

        try {
            const user = await AuthService.whereEmail(payload.email);

            await user.sendEmail(new PasswordResetLinkEmail(user));

            return {
                message: "Successfully sent password reset link.",
            } satisfies MessageResponse;
        } catch (error) {
            if (
                error instanceof Error &&
                "code" in error &&
                // To avoid leaking information about whether a user exists or not.
                error.code === AuthErrorCodes.USER_DELETED
            ) {
                return {
                    message: "Successfully sent password reset link.",
                } satisfies MessageResponse;
            }

            throw handleApiError(error);
        }
    },
};
