import { ShopStatus } from "$features/shops/enum";
import type { Paginated } from "$module/common/contract/pagination";
import type { CreateUserShopDto } from "$module/shop/dto/create-shop.dto";
import type { UpdateShopDto } from "$module/shop/dto/update-shop.dto";
import { ShopCollection } from "$module/shop/shop.collection";
import type { Shop } from "$module/shop/shop.model";
import type { PaginationMeta, PaginationQuery } from "$client/types/meta";
import { USER_COLLECTION_NAME } from "$module/user/user.collection";

import { Timestamp } from "firebase-admin/firestore";

interface PaginatedUserShops extends Paginated {
    [key: string]: Shop[] | PaginationMeta | undefined;
    shops: Shop[];
}

export const USER_SHOP_COLLECTION_NAME = "shops";

export class UserShopsCollection extends ShopCollection {
    constructor(protected userUid: string) {
        super(`${USER_COLLECTION_NAME}/${userUid}/${USER_SHOP_COLLECTION_NAME}`);
    }

    async getUserShops(queries: PaginationQuery) {
        return await this.getPaginated(queries);
    }

    static async getUserShops(uid: string, queries: PaginationQuery): Promise<PaginatedUserShops> {
        const userShopSubcollection = new UserShopsCollection(uid);

        return userShopSubcollection.getUserShops(queries);
    }

    static async getUserShop(userUid: string, shopUid: string): Promise<Shop> {
        const userShopsCollection = new UserShopsCollection(userUid);

        const snapshot = await userShopsCollection.withConverter.doc(shopUid).get();

        if (!snapshot.exists) {
            throw new Error("Shop not found.");
        }

        return snapshot.data() as Shop;
    }

    static async createShop(userUid: string, shop: CreateUserShopDto): Promise<Shop> {
        const userShopsCollection = new UserShopsCollection(userUid);

        const uid = userShopsCollection.ref.doc().id;

        await userShopsCollection.set({
            uid,
            ...shop,
            createdAt: Timestamp.fromDate(new Date()),
        });

        await userShopsCollection.increaseCounter();

        const snapshot = await userShopsCollection.withConverter.doc(uid).get();

        return snapshot.data() as Shop;
    }

    static async updateShop(userUid: string, updatedShop: UpdateShopDto): Promise<Shop> {
        const userShopsCollection = new UserShopsCollection(userUid);

        await userShopsCollection.set(updatedShop);

        const shopEntity = await userShopsCollection.get(updatedShop.uid);

        if (
            shopEntity?.status !== ShopStatus.APPROVED &&
            updatedShop.status === ShopStatus.APPROVED
        ) {
            await userShopsCollection.increaseCounter();
        }

        if (
            shopEntity?.status === ShopStatus.APPROVED &&
            updatedShop.status !== ShopStatus.APPROVED
        ) {
            await userShopsCollection.decreaseCounter();
        }

        const snapshot = await userShopsCollection.withConverter.doc(updatedShop.uid).get();

        return snapshot.data() as Shop;
    }

    static async deleteShop(userUid: string, uid: string): Promise<void> {
        const userShopsCollection = new UserShopsCollection(userUid);

        const shopEntity = await userShopsCollection.get(uid);

        await userShopsCollection.delete(uid);

        if (shopEntity?.status === ShopStatus.APPROVED) {
            await userShopsCollection.decreaseCounter();
        }
    }

    static async deleteAllShops(userUid: string, uids: string[]) {
        const userShopsCollection = new UserShopsCollection(userUid);

        uids.map(async (uid) => {
            await userShopsCollection.delete(uid);

            const shopEntity = await userShopsCollection.get(uid);

            if (shopEntity?.status === ShopStatus.APPROVED) {
                await userShopsCollection.decreaseCounter();
            }
        });
    }
}
