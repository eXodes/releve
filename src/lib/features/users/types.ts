import type { Media } from "$types/media";

export interface User {
    uid: string;
    displayName: string;
    about?: string;
    email: string;
    emailVerified: boolean;
    avatar?: Media;
    disabled: boolean;
    customClaims?: {
        isAdmin: boolean;
    };
    createdAt: string;
    information?: UserInformation;
}

export interface UserInformation {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
}
