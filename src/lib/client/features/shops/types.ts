import type { ShopStatus } from "$features/shops/enum";
import type { AddressData } from "$client/types/address";

export interface ShopData {
    uid: string;
    name: string;
    link: string;
    categories: string[];
    deliveryProviders: string[];
    address: AddressData;
    status: ShopStatus;
    createdAt: Date;
    createdBy: {
        uid: string;
        name: string;
    };
}
