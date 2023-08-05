import { handleApiError } from "$server/utils/error";
import type { SignUpCheckPayload } from "$features/authentication/validations/misc";
import { AuthService } from "$module/auth/auth.service";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const { email } = (await request.json()) as SignUpCheckPayload;

    if (!email) {
        throw handleApiError(new Error("Email is required."));
    }

    try {
        const { uid } = (await AuthService.whereEmail(email)).data;

        if (uid) {
            return json({
                available: false,
            });
        }

        return json({
            available: true,
        });
    } catch (error) {
        return json({
            available: true,
        });
    }
};
