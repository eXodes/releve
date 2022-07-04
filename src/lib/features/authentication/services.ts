import type { UserSession } from "./types";
import type { Payload } from "$routes/sign-up/check";
import type { MessageResponse } from "$types/response";

import {
    applyActionCode,
    checkActionCode,
    confirmPasswordReset,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
} from "firebase/auth";

import { auth } from "$utils/firebase";
import { endpoint } from "$utils/endpoint";

interface SessionResponse extends MessageResponse {
    user: UserSession;
}

export const AuthService = {
    isEmailRegistered: (email: string) => {
        return new Promise<void>((resolve, reject) => {
            endpoint<boolean, Payload>("/sign-up/check", {
                method: "POST",
                data: { email },
            })
                .then(() => resolve())
                .catch(() => reject());
        });
    },
    checkActionCode: async (actionCode: string) => {
        await checkActionCode(auth, actionCode);
    },
    verifyEmail: async (uid: string, actionCode: string) => {
        await applyActionCode(auth, actionCode);

        await endpoint("/sign-in/verify?uid=" + uid);

        return { message: "Email verified successfully. Please sign in." };
    },
    resetPassword: async (password: string, actionCode: string) => {
        await confirmPasswordReset(auth, actionCode, password);

        return { message: "Password reset successfully." };
    },
    updatePassword: async (email: string, currentPassword: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, currentPassword);

        const user = auth.currentUser;

        if (!user) {
            throw new Error("User not found.");
        }

        await updatePassword(user, password);

        await signOut(auth);

        return { message: "Password updated successfully." };
    },
    signIn: async (email: string, password: string, rememberMe: boolean) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);

        if (!credential.user.emailVerified) {
            throw new Error(
                "Email is not verified. Please check the link in the email and try again."
            );
        }

        const idToken = await credential.user.getIdToken();

        const { user } = await endpoint<SessionResponse>("/session", {
            method: "POST",
            body: JSON.stringify({ idToken, rememberMe }),
        });

        await signOut(auth);

        return { message: "Sign up successful.", user };
    },
    signOut: async () => {
        const { message } = await endpoint<MessageResponse>("/sign-out");

        return { message };
    },
};
