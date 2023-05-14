import type { FirestoreData } from "$server/type/firestore";

export interface CounterEntity extends FirestoreData {
    count: number;
}
