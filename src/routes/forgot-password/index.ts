import type { RequestHandler } from "./__types";

import { User } from "$_model/user";
import { SendPasswordResetLink } from "$routes/_actions/email";
import { handleError } from "$routes/_errors";
import { schema } from "$routes/_validations/authentication/forgot-password.schema";
import { validate } from "$routes/_validations";
import { getFormData } from "$utils/data";

export type Payload = {
    email: string;
};

export const post: RequestHandler = async ({ request }) => {
    const formData = await request.formData();

    const payload = getFormData<Payload>(formData);

    try {
        validate(schema, payload);

        const user = await User.whereEmail(payload.email);

        await user.sendEmail(new SendPasswordResetLink(user));

        return {
            status: 200,
            body: {
                message: "Successfully sent password reset link.",
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
