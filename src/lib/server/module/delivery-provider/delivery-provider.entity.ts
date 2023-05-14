import type { FirestoreData } from "$server/type/firestore";

export interface DeliveryProviderEntity extends FirestoreData {
    name: string;
}
