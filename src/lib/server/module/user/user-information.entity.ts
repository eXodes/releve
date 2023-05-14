import type { FirestoreData } from "$server/type/firestore";

export interface UserInformationEntity extends FirestoreData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
}
