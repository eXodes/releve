import type { UserSession } from "$features/authentication/types";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

interface BaseSession {
    authenticated: boolean;
    user?: UserSession;
}

interface AuthenticatedSession extends BaseSession {
    authenticated: true;
    user: UserSession;
}

interface UnauthenticatedSession extends BaseSession {
    authenticated: false;
    user: undefined;
}

interface LayoutOutput {
    session: AuthenticatedSession | UnauthenticatedSession;
}

export const load: LayoutServerLoad<LayoutOutput> = async ({ locals, route, url, depends }) => {
    const user = locals.session?.data;

    const publicRoutes = [
        "/",
        "/(app)",
        "/(auth)/sign-up",
        "/(auth)/sign-in",
        "/(auth)/forgot-password",
        "/(auth)/reset-password",
    ];

    const session = user
        ? ({
              authenticated: true,
              user,
          } satisfies AuthenticatedSession)
        : ({
              authenticated: false,
              user: undefined,
          } satisfies UnauthenticatedSession);

    if (!session.authenticated && !publicRoutes.includes(route.id as string)) {
        redirect(303, `/sign-in?redirect=${url.toString()}`);
    }

    depends("session");

    return {
        session,
    };
};
