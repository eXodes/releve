import type { firestore } from "firebase-admin";
import type { CounterData } from "$_model/counter";

import { Collection } from "$_model/database";

export const counterConverter = {
    toFirestore(counter: CounterData): firestore.DocumentData {
        return {
            count: counter.count,
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): CounterData {
        const data = snapshot.data();

        return {
            count: data.count,
        } as CounterData;
    },
};

export class CounterCollection extends Collection<CounterData> {
    constructor(protected uid: string) {
        super("counter", counterConverter);
    }

    set = async (value: CounterData) => {
        await this.collection.doc(this.uid).set(value, { merge: true });
    };

    get = async () => {
        const ref = this.collection.doc(this.uid);

        const doc = await ref.get();

        if (!doc.exists) return { count: 0 };

        return doc.data() as CounterData;
    };
}
