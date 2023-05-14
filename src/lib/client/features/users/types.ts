import type { AddressData } from "$client/types/address";
import type { Media } from "$client/types/media";

export interface UserData {
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
    information?: UserInformationData;
}

export interface UserInformationData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address: Partial<AddressData>;
}
