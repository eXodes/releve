import type { HasData } from "$module/common/contract/data";
import type { ShopEntity } from "$module/shop/shop.entity";

import type { ShopData } from "$features/shops/types";

export class Shop implements HasData<ShopData> {
    protected shopData: ShopData;

    constructor(uid: string, data: ShopEntity) {
        this.shopData = {
            uid: uid,
            name: data.name,
            link: data.link,
            categories: data.categories,
            deliveryProviders: data.deliveryProviders,
            address: {
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                postalCode: data.address.postalCode,
                country: data.address.country,
            },
            status: data.status,
            createdBy: {
                uid: data.createdBy.uid,
                name: data.createdBy.name,
            },
            createdAt: data.createdAt.toDate(),
        };
    }

    get data() {
        return this.shopData;
    }
}
