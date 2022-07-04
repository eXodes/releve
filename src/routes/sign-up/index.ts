import type { RequestHandler } from "./__types";

import { User } from "$_model/user";
import { SendVerificationEmail } from "$routes/_actions/email";
import { handleError } from "$routes/_errors";
import { schema } from "$routes/_validations/authentication/sign-up.schema";
import { validate } from "$routes/_validations";
import { getFormData } from "$utils/data";

export type Payload = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const post: RequestHandler = async ({ request }) => {
    const formData = await request.formData();

    const payload = getFormData<Payload>(formData);

    try {
        validate(schema, payload);

        const user = await User.create(payload);

        await user.sendEmail(new SendVerificationEmail(user));

        return {
            status: 201,
            body: {
                message: "Sign up successful.",
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
