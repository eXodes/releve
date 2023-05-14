import type { ShopEntity } from "$module/shop/shop.entity";
import { Shop } from "$module/shop/shop.model";

import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";

export const shopConverter: FirestoreConverter<Shop> = {
    toFirestore(shop) {
        return shop;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<ShopEntity>) {
        const data = snapshot.data();

        return new Shop(snapshot.id, data);
    },
};
