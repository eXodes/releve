import { handleApiError } from "$server/utils/error";
import type { UserSession } from "$features/authentication/types";
import { AuthService } from "$module/auth/auth.service";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export type Payload = {
    idToken: string;
    rememberMe: boolean;
};

export const POST: RequestHandler = async ({ request, locals }) => {
    const { idToken, rememberMe }: Payload = await request.json();

    if (!idToken) {
        throw handleApiError(new Error("No token provided."));
    }

    try {
        locals.session = await AuthService.verifyToken(idToken);

        const user: UserSession = {
            uid: locals.session.data.uid,
            email: locals.session.data.email,
            emailVerified: locals.session.data.emailVerified,
            displayName: locals.session.data.displayName,
            photoURL: locals.session.data.photoURL,
            customClaims: locals.session.data.customClaims,
            disabled: locals.session.data.disabled,
            createdAt: locals.session.data.createdAt,
        };

        return json(
            {
                authenticated: true,
                user,
            },
            {
                status: 200,
                headers: {
                    "Set-Cookie": await AuthService.createCookie(idToken, rememberMe),
                },
            }
        );
    } catch (error) {
        throw handleApiError(error);
    }
};
