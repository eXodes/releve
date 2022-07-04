import type { ShopStatus } from "$features/shops/enum";
import type { Timestamp } from "firebase-admin/firestore";

export interface ShopData {
    name: string;
    link: string;
    categories: string[];
    deliveryServices: string[];
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    status: ShopStatus;
    createdAt: Timestamp;
    createdBy: {
        uid: string;
        name: string;
    };
}
