import type { SignUpCheckPayload } from "$features/authentication/validations/misc";
import type { MessageResponse } from "$client/types/response";
import { endpoint, formEndpoint } from "$client/utils/endpoint";
import { auth } from "$client/utils/firebase";

import type { SubmitFunction } from "@sveltejs/kit";
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

type SignOutForm = (options: {
    onSuccess: (data?: MessageResponse) => Promise<void> | void;
    onError: (error: Error) => Promise<void> | void;
}) => SubmitFunction<MessageResponse>;

export class AuthService {
    static auth = auth;

    static isEmailRegistered = (email: string) => {
        return endpoint<{ available: boolean }, SignUpCheckPayload>("/sign-up/check", {
            method: "POST",
            data: { email },
        }).then(({ available }) => {
            if (!available) return Promise.reject("Email is already registered.");

            return Promise.resolve();
        });
    };

    static checkActionCode = async (actionCode: string) => {
        await checkActionCode(this.auth, actionCode);
    };

    static verifyEmail = async (uid: string, actionCode: string) => {
        await applyActionCode(this.auth, actionCode);

        const formData = new FormData();

        formData.append("uid", uid);

        await formEndpoint("/sign-in?/verify", {
            method: "POST",
            body: formData,
        });

        return { message: "Email verified successfully. Please sign in." };
    };

    static resetPassword = async (password: string, actionCode: string) => {
        const {
            data: { email },
        } = await checkActionCode(this.auth, actionCode);

        if (!email) {
            throw new FirebaseError(AuthErrorCodes.INVALID_CODE, "Invalid action code.");
        }

        const formData = new FormData();

        formData.append("email", email);

        await formEndpoint("/sign-in?/verify", {
            method: "POST",
            body: formData,
        });

        await confirmPasswordReset(this.auth, actionCode, password);

        return { message: "Password reset successfully." };
    };

    static signIn = async (email: string, password: string, rememberMe = false) => {
        const credential = await signInWithEmailAndPassword(this.auth, email, password);

        if (!credential.user.emailVerified) {
            throw new FirebaseError(AuthErrorCodes.UNVERIFIED_EMAIL, "Email not verified.", {
                uid: credential.user.uid,
            });
        }

        const idToken = await credential.user.getIdToken();

        const { user } = await endpoint<SessionResponse>("/session", {
            method: "POST",
            body: JSON.stringify({ idToken, rememberMe }),
        });

        await signOut(this.auth);

        return { message: "Sign in successful.", user };
    };

    static signOutForm: SignOutForm = ({ onSuccess, onError }) => {
        return () => {
            return async ({ result, update }) => {
                if (result.type === "error") {
                    onError(result.error);
                }

                if (result.type === "success") {
                    await update();
                    onSuccess(result.data);
                }
            };
        };
    };
}
