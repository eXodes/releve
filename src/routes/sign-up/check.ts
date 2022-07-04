import type { RequestHandler } from "./__types/check";
import type { ErrorResponse } from "$types/response";

import { AuthErrorCodes } from "firebase/auth";
import { User } from "$_model/user";
import { handleError } from "$routes/_errors";

export type Payload = {
    email: string;
};

export const post: RequestHandler<boolean | ErrorResponse> = async ({ request }) => {
    const { email } = (await request.json()) as Payload;

    if (!email) {
        return {
            status: 400,
            body: { error: "Email is required." },
        };
    }

    try {
        const { uid } = (await User.whereEmail(email)).data();

        if (uid) {
            return {
                status: 400,
                body: false,
            };
        }

        return {
            status: 200,
            body: true,
        };
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore missing type from firebase
        if (error.code === AuthErrorCodes.USER_DELETED) {
            return {
                status: 200,
                body: true,
            };
        }

        return handleError(error);
    }
};
