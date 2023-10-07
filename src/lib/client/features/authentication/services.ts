import type { SignUpCheckPayload } from "$features/authentication/validations/misc";
import type { MessageResponse } from "$client/types/response";
import { endpoint, formEndpoint } from "$client/utils/endpoint";
import { auth } from "$client/utils/firebase";
import * as Sentry from "@sentry/sveltekit";

import { FirebaseError } from "firebase/app";

import {
    applyActionCode,
    AuthErrorCodes,
    checkActionCode,
    confirmPasswordReset,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import type { UserSession } from "./types";

interface SessionResponse extends MessageResponse {
    user: UserSession;
}

export const AuthService = {
    isEmailRegistered: (email: string) => {
        return endpoint<{ available: boolean }, SignUpCheckPayload>("/sign-up/check", {
            method: "POST",
            data: { email },
        }).then(({ available }) => {
            return available;
        });
    },
    checkActionCode: async (actionCode: string) => {
        await checkActionCode(auth, actionCode);
    },
    verifyEmail: async (uid: string, actionCode: string) => {
        await applyActionCode(auth, actionCode);

        const formData = new FormData();

        formData.append("uid", uid);

        await formEndpoint("/sign-in?/verify", {
            method: "POST",
            body: formData,
        });

        return { message: "Email verified successfully. Please sign in." };
    },
    resetPassword: async (password: string, actionCode: string) => {
        const {
            data: { email },
        } = await checkActionCode(auth, actionCode);

        if (!email) {
            throw new FirebaseError(AuthErrorCodes.INVALID_CODE, "Invalid action code.");
        }

        const formData = new FormData();

        formData.append("email", email);

        await formEndpoint("/sign-in?/verify", {
            method: "POST",
            body: formData,
        });

        await confirmPasswordReset(auth, actionCode, password);

        return { message: "Password reset successfully." };
    },
    signIn: async (email: string, password: string, rememberMe = false) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);

        if (!credential.user.emailVerified) {
            throw new FirebaseError(AuthErrorCodes.UNVERIFIED_EMAIL, "Email not verified.", {
                uid: credential.user.uid,
            });
        }

        Sentry.setUser({ id: credential.user.uid });

        const idToken = await credential.user.getIdToken();

        const { user } = await endpoint<SessionResponse>("/session", {
            method: "POST",
            body: JSON.stringify({ idToken, rememberMe }),
        });

        await signOut(auth);

        return { message: "Sign in successful.", user };
    },
};
