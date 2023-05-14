import type { ShopStatus } from "$features/shops/enum";
import type { ShopEntity } from "$module/shop/shop.entity";

export interface CreateShopDto extends Partial<ShopEntity> {
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
}

export interface CreateUserShopDto extends Partial<ShopEntity> {
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
    createdBy: {
        uid: string;
        name: string;
    };
}
