import type { FirestoreData } from "$server/type/firestore";
import type { UserInformationEntity } from "$module/user/user-information.entity";

import type { Media } from "$client/types/media";

import type { Timestamp } from "firebase-admin/firestore";

export interface UserEntity extends FirestoreData {
    displayName: string;
    about?: string;
    email: string;
    emailVerified: boolean;
    avatar: Media;
    disabled: boolean;
    customClaims: {
        isAdmin: boolean;
    };
    createdAt: Timestamp | string;
    information?: UserInformationEntity;
}
