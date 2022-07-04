import type { firestore } from "firebase-admin";

import { getFirestore } from "firebase-admin/firestore";

export interface BaseEntity {
    uid: string | null;
}

interface Query {
    fieldPath: string | firestore.FieldPath;
    opStr: firestore.WhereFilterOp;
    value: string | number | boolean;
}

interface Database<T> {
    add: (value: T) => Promise<void>;
    set: (value: BaseEntity & T) => Promise<void>;
    get: (uid: string) => Promise<T>;
    getAll: () => Promise<T[]>;
    query: (snapshot: firestore.Query, queries: Query) => firestore.Query;
    delete: (uid: string) => Promise<T[] | void>;
}

export abstract class Collection<T> implements Database<T> {
    protected collection: firestore.CollectionReference<T>;

    protected constructor(collection: string, converter: firestore.FirestoreDataConverter<T>) {
        this.collection = getFirestore().collection(collection).withConverter(converter);
    }

    async add(value: T) {
        await this.collection.doc().set(value);
    }

    async set({ uid, ...rest }: Partial<BaseEntity & T>) {
        if (!uid) throw new Error("Document ID is required.");

        await this.collection.doc(uid).set(rest as T, { merge: true });
    }

    async get(uid: string) {
        const ref = this.collection.doc(uid);

        const doc = await ref.get();

        if (!doc.exists) throw new Error("Document doesn't exist.");

        return doc.data() as T;
    }

    async getAll() {
        const snapshot = await this.collection.get();

        if (snapshot.empty) return [];

        return snapshot.docs.map((data) => ({ uid: data.id, ...data.data() } as T));
    }

    query(snapshot: firestore.Query, queries: Query) {
        return snapshot.where(queries.fieldPath, queries.opStr, queries.value);
    }

    async delete(uid: string) {
        await this.collection.doc(uid).delete();
    }
}
