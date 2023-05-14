import type { FirestoreData } from "$server/type/firestore";

export interface CategoryEntity extends FirestoreData {
    name: string;
}
