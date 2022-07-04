import type { firestore } from "firebase-admin";
import type { BaseEntity } from "$_model/database";
import type { UserData } from "$_model/user";
import type { Observer, Subject } from "$routes/_contracts/observable";
import type { HasCounter, HasPagination } from "$routes/_contracts/pagination";
import type { MetaQuery, PaginationMeta } from "$types/meta";

import { isArray } from "lodash-es";
import { stringify } from "qs";

import { CounterCollection } from "$_collection/counter";
import { Collection } from "$_model/database";

export const userConverter = {
    toFirestore(user: UserData): firestore.DocumentData {
        return {
            displayName: user.displayName,
            about: user.about,
            email: user.email,
            emailVerified: user.emailVerified,
            avatar: user.avatar,
            disabled: user.disabled,
            customClaims: {
                isAdmin: user.customClaims?.isAdmin ?? false,
            },
            information: user.information,
            createdAt: user.createdAt,
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): UserData {
        const data = snapshot.data();

        return {
            displayName: data.displayName,
            about: data.about,
            email: data.email,
            emailVerified: data.emailVerified,
            avatar: data.avatar,
            disabled: data.disabled,
            customClaims: {
                isAdmin: data.customClaims?.isAdmin ?? false,
            },
            information: data.information,
            createdAt: data.createdAt.toDate(),
        } as UserData;
    },
};

export class UserCollection
    extends Collection<UserData>
    implements HasPagination<UserData>, HasCounter, Subject
{
    private observers: Observer[] = [];
    private counterCollection: CounterCollection;

    constructor() {
        super("users", userConverter);
        this.counterCollection = new CounterCollection("shops");
    }

    attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);

        if (!isExist) {
            this.observers = [...this.observers, observer];
        }
    }

    detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);

        if (observerIndex) {
            this.observers.splice(observerIndex, 1);
        }
    }

    notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    create = async ({ ...user }: Partial<BaseEntity & UserData>) => {
        await super.set(user);

        this.increaseCounter();
    };

    set = async ({ ...user }: Partial<BaseEntity & UserData>) => {
        await super.set(user);

        this.notify();
    };

    delete = async (uid: string): Promise<void> => {
        await super.delete(uid);

        this.decreaseCounter();

        this.notify();
    };

    deleteAll = async (uids: string | string[]) => {
        isArray(uids) ? uids.map(async (uid) => await this.delete(uid)) : await this.delete(uids);
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
                    : `/users?${stringify({ offset: offset - limit, limit, orderBy })}`,
            next: nextSnapshot?.empty
                ? null
                : `/users?${stringify({ offset: offset + limit, limit, orderBy })}`,
        };
    };

    getPaginated = async ({
        limit,
        orderBy,
        offset,
        search,
    }: MetaQuery): Promise<{ users: (BaseEntity & UserData)[]; meta: PaginationMeta }> => {
        let collection = this.collection.orderBy(orderBy);

        if (search) {
            collection = collection.where("email", "==", search);
        }

        collection = offset ? collection.limit(limit).offset(offset) : collection.limit(limit);

        const snapshots = await collection.get();

        if (snapshots.empty)
            return { users: [], meta: { total: null, previous: null, next: null } };

        const users = snapshots.docs.map((snapshot) => ({ uid: snapshot.id, ...snapshot.data() }));
        const meta = await this.getPaginationMeta(snapshots, { limit, orderBy, offset });

        return { users, meta };
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
