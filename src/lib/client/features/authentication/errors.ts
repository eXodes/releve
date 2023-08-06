import type { MessageResponse } from "$client/types/response";

import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

interface UnverifiedEmailError extends MessageResponse {
    code: typeof AuthErrorCodes.UNVERIFIED_EMAIL;
    message: string;
    uid: string;
}

interface InvalidEmailError extends MessageResponse {
    code: typeof AuthErrorCodes.INVALID_EMAIL;
    message: string;
    email: string;
}

export const handleAuthCatch = (
    error: unknown
): MessageResponse | UnverifiedEmailError | InvalidEmailError => {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case AuthErrorCodes.UNVERIFIED_EMAIL:
                return {
                    code: error.code,
                    message: "Please verify your email address.",
                    uid: error.customData?.uid as string,
                };
            case AuthErrorCodes.INVALID_EMAIL:
                return {
                    code: error.code,
                    message: "Invalid email address provided.",
                    email: error.customData?.email as string,
                };
            case AuthErrorCodes.INVALID_PASSWORD:
                return {
                    message: "Sign in failed. Please check your email and password.",
                };
            case AuthErrorCodes.USER_DELETED:
                return {
                    message: "No registered user found with this email address.",
                };
            case AuthErrorCodes.USER_DISABLED:
                return {
                    message: "This user has been disabled.",
                };
            case AuthErrorCodes.WEAK_PASSWORD:
                return {
                    message: "The password provided is too weak.",
                };
            case AuthErrorCodes.MISSING_CODE:
                return {
                    message: "The code provided is invalid.",
                };
            case AuthErrorCodes.INVALID_OOB_CODE:
                return {
                    message:
                        "The action code is invalid or already used. Please request a new one.",
                };
            case AuthErrorCodes.EXPIRED_OOB_CODE:
                return {
                    message: "The action code has expired. Please request a new one.",
                };
            default:
                return {
                    message: "An unknown Firebase error occurred.",
                };
        }
    } else if (error instanceof Error) {
        return { message: error.message };
    } else {
        return { message: "An unknown error occurred during authentication." };
    }
};
