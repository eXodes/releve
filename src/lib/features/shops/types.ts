import type { ShopStatus } from "$features/shops/enum";

export interface Shop {
    uid: string;
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
    createdAt: string;
    createdBy: {
        uid: string;
        name: string;
    };
}
