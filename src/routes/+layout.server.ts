import type { UserSession } from "$features/authentication/types";

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

export const load: LayoutServerLoad<LayoutOutput> = async ({ locals, depends }) => {
    const user = locals.session?.data;

    const session = user
        ? ({
              authenticated: true,
              user,
          } satisfies AuthenticatedSession)
        : ({
              authenticated: false,
              user: undefined,
          } satisfies UnauthenticatedSession);

    depends("session");

    return {
        session,
    };
};
