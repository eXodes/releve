import type { GetSession, Handle, HandleError } from "@sveltejs/kit";

import "dotenv/config";

import "./admin";
import { dev } from "$app/env";
import { User } from "$_model/user";
import { SESSION_COOKIE } from "$config/cookie";
import { getCookie } from "$utils/endpoint";

export const handle: Handle = async ({ event, resolve }) => {
    try {
        event.locals.user = await User.verifySession(
            getCookie(event.request.headers, SESSION_COOKIE)
        );

        return resolve(event);
    } catch (error) {
        return resolve(event);
    }
};

export const getSession: GetSession = ({ locals }) => {
    const userData = locals.user?.data();

    return userData
        ? {
              authenticated: true,
              user: {
                  uid: userData.uid,
                  email: userData.email,
                  name: userData.displayName,
                  avatar: userData.photoURL,
                  claims: userData.customClaims,
                  verified: userData.emailVerified,
              },
          }
        : {
              authenticated: false,
              user: undefined,
          };
};

export const handleError: HandleError = ({ error, event }) => {
    if (dev) console.error("handleError", error, event);
    // TODO: integration with https://sentry.io/
    // Sentry.captureException(error, { event });
};
