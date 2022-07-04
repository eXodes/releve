import type { firestore } from "firebase-admin";
import type { BaseEntity } from "$_model/database";
import type { ShopData } from "$_model/shop";
import type { Observer, Subject } from "$routes/_contracts/observable";
import type { HasCounter, HasPagination } from "$routes/_contracts/pagination";
import type { MetaQuery, PaginationMeta } from "$types/meta";

import { isArray } from "lodash-es";
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

    constructor() {
        super("shops", shopConverter);
        this.counterCollection = new CounterCollection("shops");
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

    add = async (shop: ShopData) => {
        await super.add(shop);

        if (shop.status === ShopStatus.APPROVED) {
            await this.increaseCounter();
        }
    };

    set = async (shop: Partial<BaseEntity & ShopData>) => {
        const shopData = await super.get(shop.uid as string);

        super.set(shop);

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

    deleteAll = async (uids: string | string[]) => {
        isArray(uids) ? uids.map(async (uid) => await this.delete(uid)) : await this.delete(uids);
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
                    : `/shops?${stringify({ offset: offset - limit, limit, orderBy })}`,
            next: nextSnapshot?.empty
                ? null
                : `/shops?${stringify({ offset: offset + limit, limit, orderBy })}`,
        };
    };

    getPaginated = async ({
        limit,
        orderBy,
        offset,
        status,
    }: MetaQuery): Promise<{ shops: (BaseEntity & ShopData)[]; meta: PaginationMeta }> => {
        let collection = this.collection.orderBy(orderBy);

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

    getCount = async (): Promise<number> => {
        const { count } = await this.counterCollection.get();

        return count;
    };

    increaseCounter = async () => {
        const count = await this.getCount();

        await this.counterCollection.set({
            count: count + 1,
        });
    };

    decreaseCounter = async () => {
        const count = await this.getCount();

        await this.counterCollection.set({
            count: count - 1,
        });
    };
}
