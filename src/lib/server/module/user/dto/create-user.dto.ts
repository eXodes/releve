import type { Media } from "$client/types/media";

export interface CreateUserDto {
    uid: string;
    displayName: string;
    about?: string;
    email: string;
    emailVerified: boolean;
    avatar: Media;
    disabled: boolean;
    customClaims: {
        isAdmin: boolean;
    };
    createdAt: Date;
}
