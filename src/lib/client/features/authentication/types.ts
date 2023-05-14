import type { auth } from "firebase-admin";

export interface UserSession extends Partial<auth.UserRecord> {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    photoURL: string;
    customClaims: {
        isAdmin: boolean;
    };
    disabled: boolean;
    createdAt: Date;
}
