import type { FirestoreQueryDocSnapshot } from "$server/type/firestore";
import { handleApiError } from "$server/utils/error";
import { AuthService } from "$module/auth/auth.service";
import type { HasPagination, Paginated } from "$module/common/contract/pagination";
import { Collection } from "$module/common/services/collection.service";
import { CounterCollection } from "$module/counter/counter.collection";
import type { HasCounter } from "$module/counter/counter.contract";
import type { CreateUserDto } from "$module/user/dto/create-user.dto";
import type { UpdateUserDto } from "$module/user/dto/update-user.dto";
import { userConverter } from "$module/user/user.converter";
import type { UserEntity } from "$module/user/user.entity";
import type { User } from "$module/user/user.model";
import type { PaginationMeta, PaginationQuery, SearchQuery } from "$client/types/meta";

import { Timestamp } from "firebase-admin/firestore";

interface PaginatedUsers extends Paginated {
    [key: string]: User[] | PaginationMeta | undefined;
    users: User[];
}

export const USER_COLLECTION_NAME = "users";

export class UserCollection
    extends Collection<UserEntity, User>
    implements HasPagination<User>, HasCounter
{
    private counterCollection: CounterCollection;

    constructor() {
        super(USER_COLLECTION_NAME, userConverter);
        this.counterCollection = new CounterCollection(this.collectionName);
    }

    async getPaginationMeta(
        last: FirestoreQueryDocSnapshot<User>,
        { limit, orderBy, offset }: PaginationQuery
    ) {
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
    }: PaginationQuery & SearchQuery): Promise<PaginatedUsers> {
        let collection = this.ref.orderBy(orderBy);

        if (search) {
            collection = await collection.where("email", "==", search);
        }

        collection = offset ? collection.limit(limit).offset(offset) : collection.limit(limit);

        const snapshot = await collection.withConverter(this.converter).get();

        if (snapshot.empty) return { users: [], meta: undefined };

        const users = snapshot.docs.map((snapshot) => snapshot.data());

        const last = snapshot.docs[snapshot.docs.length - 1];

        const meta = await this.getPaginationMeta(last, { limit, orderBy, offset });

        return { users, meta };
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

    static async create(user: CreateUserDto) {
        const userCollection = new UserCollection();

        await userCollection.set({
            ...user,
            createdAt: Timestamp.fromDate(user.createdAt),
        });

        await userCollection.increaseCounter();

        const snapshot = await userCollection.withConverter.doc(user.uid).get();

        return snapshot.data() as User;
    }

    static async update(user: UpdateUserDto) {
        const userCollection = new UserCollection();

        await userCollection.set(user);

        const snapshot = await userCollection.withConverter.doc(user.uid).get();

        return snapshot.data() as User;
    }

    static async delete(uid: string): Promise<void> {
        const userCollection = new UserCollection();

        const user = await UserCollection.getUserByUid(uid);

        if (!user) {
            throw handleApiError(new Error("User not found."));
        }

        user?.attachObserver(new AuthService().createObserver());

        await userCollection.delete(uid);

        await userCollection.decreaseCounter();

        user?.notifyObserver();
    }

    static async deleteAll(uids: string[]) {
        uids.map(async (uid) => {
            await UserCollection.delete(uid);
        });
    }

    static async getUsers({
        limit,
        orderBy,
        offset,
        search,
    }: PaginationQuery & SearchQuery): Promise<PaginatedUsers> {
        const userCollection = new UserCollection();

        return await userCollection.getPaginated({
            limit,
            orderBy,
            offset,
            search,
        });
    }

    static async getUserByUid(uid: string): Promise<User | undefined> {
        const userCollection = new UserCollection();

        const snapshot = await userCollection.withConverter.doc(uid).get();

        return snapshot.data();
    }
}
