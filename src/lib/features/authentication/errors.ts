import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

export const handleAuthCatch = (error: unknown) => {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case AuthErrorCodes.INVALID_EMAIL:
                return "Invalid email address provided.";
            case AuthErrorCodes.INVALID_PASSWORD:
                return "Sign in failed. Please check your email and password.";
            case AuthErrorCodes.USER_DELETED:
                return "No registered user found with this email address.";
            case AuthErrorCodes.USER_DISABLED:
                return "This user has been disabled.";
            case AuthErrorCodes.WEAK_PASSWORD:
                return "The password provided is too weak.";
            case AuthErrorCodes.MISSING_CODE:
                return "The code provided is invalid.";
            case AuthErrorCodes.INVALID_OOB_CODE:
                return "The action code is invalid or already used. Please request a new one.";
            case AuthErrorCodes.EXPIRED_OOB_CODE:
                return "The action code has expired. Please request a new one.";
            default:
                return "An unknown Firebase error occurred.";
        }
    } else if (error instanceof Error) {
        return error.message;
    }
};
