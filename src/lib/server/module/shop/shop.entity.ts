import type { ShopStatus } from "$features/shops/enum";
import type { FirestoreData } from "$server/type/firestore";

import type { Timestamp } from "firebase-admin/firestore";

export interface ShopEntity extends FirestoreData {
    name: string;
    link: string;
    categories: string[];
    deliveryProviders: string[];
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    status: ShopStatus;
    createdBy: {
        uid: string;
        name: string;
    };
    createdAt: Timestamp;
}
