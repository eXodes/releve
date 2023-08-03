import type { BaseEntity } from "$module/common/contract/database";
import { FirestoreDatabase } from "$module/common/contract/database";
import app from "$server/services/firebase-admin";
import type {
    FirestoreCollectionRef,
    FirestoreConverter,
    FirestoreData,
    FirestorePartialValue,
    FirestoreValue,
} from "$server/type/firestore";

import type { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export abstract class Collection<
    Entity extends FirestoreData,
    Data,
> extends FirestoreDatabase<Entity> {
    protected constructor(
        protected collectionName: string,
        protected converter: FirestoreConverter<Data>
    ) {
        super();
    }

    public get ref(): FirestoreCollectionRef<Entity> {
        return getFirestore(app as App).collection(
            this.collectionName
        ) as FirestoreCollectionRef<Entity>;
    }

    public get withConverter() {
        return this.ref.withConverter(this.converter);
    }

    protected async add(value: FirestoreValue<Entity>) {
        const doc = await this.ref.add(value);

        const snapshot = await doc.get();

        return snapshot.data();
    }

    protected async set({ uid, ...rest }: BaseEntity & FirestorePartialValue<Entity>) {
        if (!uid) throw new Error("Document ID is required.");

        await this.ref.doc(uid).set(rest as FirestorePartialValue<Entity>, { merge: true });
    }

    protected async get(uid: BaseEntity["uid"]) {
        const doc = await this.ref.doc(uid).get();

        if (!doc.exists) throw new Error("Document doesn't exist.");

        return doc.data();
    }

    protected async getAll() {
        const snapshot = await this.ref.get();

        if (snapshot.empty) return [];

        return snapshot.docs.map((data) => ({ uid: data.id, ...data.data() }) as Entity);
    }

    protected async delete(uid: BaseEntity["uid"]) {
        await this.ref.doc(uid).delete();
    }
}
