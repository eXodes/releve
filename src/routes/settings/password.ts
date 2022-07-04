import { handleError } from "$routes/_errors";
import { validate } from "$routes/_validations";
import { schema } from "$routes/_validations/settings/update-password.schema";
import type { RequestHandler } from "./__types/account";

import { getFormData } from "$utils/data";

export type Payload = {
    password: string;
    confirmPassword: string;
};

export const post: RequestHandler = async ({ request, locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    try {
        const formData = await request.formData();

        const payload = getFormData<Payload>(formData);

        validate(schema, payload);

        await locals.user?.updatePassword(payload.password);

        return {
            status: 200,
            body: {
                success: true,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
