import type { firestore } from "firebase-admin";
import type { BaseEntity } from "$_model/database";
import type { ShopData } from "$_model/shop";
import type { Observer, Subject } from "$routes/_contracts/observable";
import type { HasCounter, HasPagination } from "$routes/_contracts/pagination";
import type { MetaQuery, PaginationMeta } from "$types/meta";
import type { PartialByKeys } from "$types/utils";

import { stringify } from "qs";

import { CounterCollection } from "$_collection/counter";
import { Collection } from "$_model/database";
import { User } from "$_model/user";
import { ShopStatus } from "$features/shops/enum";

export const shopConverter = {
    toFirestore(shop: ShopData): firestore.DocumentData {
        return {
            name: shop.name,
            link: shop.link,
            categories: shop.categories,
            deliveryServices: shop.deliveryServices,
            address: {
                street: shop.address.street,
                city: shop.address.city,
                state: shop.address.state,
                postalCode: shop.address.postalCode,
                country: shop.address.country,
            },
            status: shop.status,
            createdAt: shop.createdAt,
            createdBy: {
                uid: shop.createdBy.uid,
                name: shop.createdBy.name,
            },
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): ShopData {
        const data = snapshot.data();

        return {
            name: data.name,
            link: data.link,
            categories: data.categories,
            deliveryServices: data.deliveryServices,
            address: {
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                postalCode: data.address.postalCode,
                country: data.address.country,
            },
            status: data.status,
            createdAt: data.createdAt.toDate(),
            createdBy: {
                uid: data.createdBy.uid,
                name: data.createdBy.name,
            },
        } as ShopData;
    },
};

export class ShopCollection
    extends Collection<ShopData>
    implements HasPagination<ShopData>, HasCounter, Observer
{
    private counterCollection: CounterCollection;

    constructor(collection = "shops", private route = "/shops") {
        super(collection, shopConverter);
        this.counterCollection = new CounterCollection(collection);
    }

    private updateUser = async (user: User) => {
        const userData = user.data();

        const querySnapshot = await this.collection
            .where("createdBy.uid", "==", userData.uid)
            .get();

        querySnapshot.docs.forEach((doc) => {
            const shopData = doc.data();

            shopData.createdBy = {
                uid: userData.uid,
                name: userData.displayName,
            };

            this.set({
                uid: doc.id,
                ...shopData,
            });
        });
    };

    add = async (shop: PartialByKeys<ShopData, "status">) => {
        await super.add({
            ...shop,
            status: shop.status ?? ShopStatus.PENDING,
        });

        if (shop.status === ShopStatus.APPROVED) {
            await this.increaseCounter();
        }
    };

    set = async (shop: Partial<BaseEntity & ShopData>) => {
        const shopData = await this.get(shop.uid as string);

        await super.set(shop);

        if (shopData.status !== ShopStatus.APPROVED && shop.status === ShopStatus.APPROVED) {
            await this.increaseCounter();
        } else if (shopData.status === ShopStatus.APPROVED && shop.status !== ShopStatus.APPROVED) {
            await this.decreaseCounter();
        }
    };

    delete = async (uid: string) => {
        const shop = await this.get(uid);

        await super.delete(uid);

        if (shop.status === ShopStatus.APPROVED) {
            await this.decreaseCounter();
        }
    };

    deleteAll = async (uids: string[]) => {
        const approvedUids = uids.map(async (uid) => {
            const shop = await this.get(uid);

            await super.delete(uid);

            if (shop.status === ShopStatus.APPROVED) {
                return uid;
            } else {
                return null;
            }
        });

        const counter = await Promise.allSettled(approvedUids).then((results) => {
            return results
                .map((result) => (result.status === "fulfilled" ? result.value : null))
                .filter((uid) => uid !== null).length;
        });

        await this.decreaseCounter(counter);
    };

    update = async (subject: Subject) => {
        if (subject instanceof User) {
            await this.updateUser(subject);
        }
    };

    getPaginationMeta = async (
        snapshot: firestore.QuerySnapshot,
        { limit, orderBy, offset }: MetaQuery
    ) => {
        const count = await this.getCount();

        const last = snapshot.docs[snapshot.docs.length - 1];

        let nextSnapshot;

        if (last.exists) {
            nextSnapshot = await this.collection
                .orderBy(orderBy)
                .startAfter(last.data()[orderBy])
                .limit(1)
                .get();
        }

        return {
            total: count,
            previous:
                offset === 0
                    ? null
                    : `${this.route}?${stringify({ offset: offset - limit, limit, orderBy })}`,
            next: nextSnapshot?.empty
                ? null
                : `${this.route}?${stringify({ offset: offset + limit, limit, orderBy })}`,
        };
    };

    getPaginated = async ({
        limit,
        orderBy,
        offset,
        status,
        search,
    }: MetaQuery): Promise<{ shops: (BaseEntity & ShopData)[]; meta: PaginationMeta }> => {
        let collection = this.collection.orderBy(orderBy);

        if (search) {
            collection = collection.where("name", "==", search);
        }

        if (status) {
            collection = collection.where("status", "==", status);
        }

        collection = offset ? collection.limit(limit).offset(offset) : collection.limit(limit);

        const snapshots = await collection.get();

        if (snapshots.empty)
            return { shops: [], meta: { total: null, previous: null, next: null } };

        const shops = snapshots.docs.map((snapshot) => ({ uid: snapshot.id, ...snapshot.data() }));
        const meta = await this.getPaginationMeta(snapshots, { limit, orderBy, offset });

        return { shops, meta };
    };

    getShops = async ({
        limit,
        orderBy,
        offset,
        search,
    }: MetaQuery): Promise<{
        shops: (BaseEntity & ShopData)[];
        meta: PaginationMeta;
    }> => {
        return this.getPaginated({
            limit,
            orderBy,
            offset,
            search,
        });
    };

    getApprovedShops = async ({
        limit,
        orderBy,
        offset,
    }: MetaQuery): Promise<{
        shops: (BaseEntity & ShopData)[];
        meta: PaginationMeta;
    }> => {
        return this.getPaginated({
            limit,
            orderBy,
            offset,
            status: ShopStatus.APPROVED,
        });
    };

    getCount = async (): Promise<number> => {
        const { count } = await this.counterCollection.get();

        return count;
    };

    increaseCounter = async (value = 1) => {
        const count = await this.getCount();

        await this.counterCollection.set({
            count: count + value,
        });
    };

    decreaseCounter = async (value = 1) => {
        const count = await this.getCount();

        await this.counterCollection.set({
            count: count - value,
        });
    };
}
