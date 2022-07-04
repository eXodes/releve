import type { RequestHandler } from "./__types/session";
import type { ErrorResponse } from "$types/response";

import { User } from "$_model/user";
import { handleError } from "$routes/_errors";

export type Payload = {
    idToken: string;
    rememberMe: boolean;
};

export const post: RequestHandler<App.Session | ErrorResponse> = async ({ request, locals }) => {
    try {
        const { idToken, rememberMe }: Payload = await request.json();

        if (!idToken) {
            return handleError(new Error("No token provided."));
        }

        locals.user = await User.verifyToken(idToken);

        const userData = locals.user.data();

        return {
            status: 200,
            headers: {
                "Set-Cookie": await locals.user.createCookie(idToken, rememberMe),
            },
            body: {
                authenticated: true,
                user: {
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.displayName,
                    avatar: userData.photoURL,
                    claims: userData.customClaims,
                    verified: userData.emailVerified ?? false,
                },
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
