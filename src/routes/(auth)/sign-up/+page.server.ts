import { validate } from "$server/utils/validation";
import type { SignUpPayload } from "$features/authentication/validations/sign-up";
import { VerificationEmail } from "$module/auth/actions/email";
import { AuthService } from "$module/auth/auth.service";
import { signUpSchema } from "$module/auth/validation/new-account.schema";
import { getFormData } from "$client/utils/data";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const payload = getFormData<SignUpPayload>(formData);

        const errors = validate(signUpSchema, payload);

        if (errors) {
            return fail(400, errors);
        }

        const user = await AuthService.create(payload);

        await user.sendEmail(new VerificationEmail(user));

        return {
            message: "Sign up successful.",
        };
    },
};
