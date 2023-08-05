import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";
import type { CounterEntity } from "$module/counter/counter.entity";
import { Counter } from "$module/counter/counter.model";

export const counterConverter: FirestoreConverter<Counter> = {
    toFirestore(counter) {
        return counter;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<CounterEntity>) {
        const data = snapshot.data();

        return new Counter(snapshot.id, data);
    },
};
