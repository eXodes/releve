import { ShopStatus } from "$features/shops/enum";
import type { HasObserver, Observer } from "$module/common/contract/observable";
import type { HasPagination, Paginated } from "$module/common/contract/pagination";
import { Collection } from "$module/common/services/collection.service";
import { CounterCollection } from "$module/counter/counter.collection";
import type { HasCounter } from "$module/counter/counter.contract";
import type { CreateShopDto } from "$module/shop/dto/create-shop.dto";
import type { UpdateShopDto } from "$module/shop/dto/update-shop.dto";
import { ShopCollectionObserver } from "$module/shop/shop-collection.observer";
import { shopConverter } from "$module/shop/shop.converter";
import type { ShopEntity } from "$module/shop/shop.entity";
import type { Shop } from "$module/shop/shop.model";
import type { PaginationMeta, PaginationQuery, SearchQuery } from "$client/types/meta";
import type { FirestoreQueryDocSnapshot } from "$server/type/firestore";

import { Timestamp } from "firebase-admin/firestore";

interface PaginatedShops extends Paginated {
    [key: string]: Shop[] | PaginationMeta | undefined;
    shops: Shop[];
}

export const SHOP_COLLECTION_NAME = "shops";

export class ShopCollection
    extends Collection<ShopEntity, Shop>
    implements HasPagination<Shop>, HasCounter, HasObserver
{
    private counterCollection: CounterCollection;

    constructor(protected collectionName = SHOP_COLLECTION_NAME) {
        super(collectionName, shopConverter);
        this.counterCollection = new CounterCollection(this.collectionName);
    }

    createObserver(): Observer {
        return new ShopCollectionObserver(this);
    }

    async getPaginationMeta(
        last: FirestoreQueryDocSnapshot<Shop>,
        { limit, orderBy, offset }: PaginationQuery
    ): Promise<PaginationMeta> {
        const count = await this.getCount();

        let nextSnapshot;

        if (last.exists) {
            nextSnapshot = await this.ref.orderBy(orderBy).startAfter(last).limit(1).get();
        }

        return {
            total: count,
            previous: offset === 0 ? null : { offset: offset - limit, limit, orderBy },
            next: nextSnapshot?.empty ? null : { offset: offset + limit, limit, orderBy },
        };
    }

    async getPaginated({
        limit,
        orderBy,
        offset,
        search,
        status,
    }: PaginationQuery): Promise<PaginatedShops> {
        let queryCollection = this.ref.orderBy(orderBy);

        if (search) {
            queryCollection = queryCollection.where("name", "==", search);
        }

        if (status) {
            queryCollection = queryCollection.where("status", "==", status);
        }

        queryCollection = offset
            ? queryCollection.limit(limit).offset(offset)
            : queryCollection.limit(limit);

        const snapshot = await queryCollection.withConverter(this.converter).get();

        if (snapshot.empty) return { shops: [], meta: undefined };

        const shops = snapshot.docs.map((snapshot) => snapshot.data());

        const last = snapshot.docs[snapshot.docs.length - 1];

        const meta = await this.getPaginationMeta(last, { limit, orderBy, offset });

        return { shops, meta };
    }

    async getCount(): Promise<number> {
        const counter = await this.counterCollection.getCounter();

        return counter.data.count;
    }

    async increaseCounter() {
        const count = await this.getCount();

        await this.counterCollection.updateCounter({
            count: count + 1,
        });
    }

    async decreaseCounter() {
        const count = await this.getCount();

        await this.counterCollection.updateCounter({
            count: count - 1,
        });
    }

    static async create(shop: CreateShopDto) {
        const shopCollection = new ShopCollection();
        const uid = shopCollection.ref.doc().id;

        await shopCollection.set({
            uid,
            ...shop,
            createdAt: Timestamp.fromDate(new Date()),
        });

        if (shop.status === ShopStatus.APPROVED) {
            await shopCollection.increaseCounter();
        }

        const snapshot = await shopCollection.withConverter.doc(uid).get();

        return snapshot.data() as Shop;
    }

    static async update(updatedShop: UpdateShopDto) {
        const shopCollection = new ShopCollection();

        const shopEntity = await shopCollection.get(updatedShop.uid);

        await shopCollection.set(updatedShop);

        if (
            shopEntity?.status !== ShopStatus.APPROVED &&
            updatedShop.status === ShopStatus.APPROVED
        ) {
            await shopCollection.increaseCounter();
        }

        if (
            shopEntity?.status === ShopStatus.APPROVED &&
            updatedShop.status !== ShopStatus.APPROVED
        ) {
            await shopCollection.decreaseCounter();
        }

        const snapshot = await shopCollection.withConverter.doc(updatedShop.uid).get();

        return snapshot.data() as Shop;
    }

    static async delete(uid: string): Promise<void> {
        const shopCollection = new ShopCollection();

        const shopEntity = await shopCollection.get(uid);

        await shopCollection.delete(uid);

        if (shopEntity?.status === ShopStatus.APPROVED) {
            await shopCollection.decreaseCounter();
        }
    }

    static async deleteAll(uids: string[]) {
        const shopCollection = new ShopCollection();

        uids.map(async (uid) => {
            const shopEntity = await shopCollection.get(uid);

            await shopCollection.delete(uid);

            if (shopEntity?.status === ShopStatus.APPROVED) {
                await shopCollection.decreaseCounter();
            }
        });
    }

    static async getShops({
        limit,
        orderBy,
        offset,
        search,
    }: PaginationQuery & SearchQuery): Promise<PaginatedShops> {
        const shopCollection = new ShopCollection();

        const { shops, meta } = await shopCollection.getPaginated({
            limit,
            orderBy,
            offset,
            search,
        });

        return { shops, meta };
    }

    static async getApprovedShops({
        limit,
        orderBy,
        offset,
        search,
    }: PaginationQuery & SearchQuery): Promise<PaginatedShops> {
        const shopCollection = new ShopCollection();

        const { shops, meta } = await shopCollection.getPaginated({
            limit,
            orderBy,
            offset,
            search,
            status: ShopStatus.APPROVED,
        });

        return { shops, meta };
    }
}
