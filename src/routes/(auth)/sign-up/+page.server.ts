import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import { VerificationEmail } from "$module/auth/actions/email";
import { AuthService } from "$module/auth/auth.service";
import { signUpSchema } from "$module/auth/validation/new-account.schema";

import type { SignUpPayload } from "$features/authentication/validations/sign-up";
import { getFormData } from "$client/utils/data";
import type { MessageResponse } from "$client/types/response";

import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const payload = getFormData<SignUpPayload>(formData);

        const errors = validate(signUpSchema, payload);

        if (errors) {
            return handleApiError(errors);
        }

        const user = await AuthService.create(payload);

        await user.sendEmail(new VerificationEmail(user));

        return {
            message: "Sign up successful.",
        } satisfies MessageResponse;
    },
};
