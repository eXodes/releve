import type { FirestoreData } from "$server/type/firestore";

export interface StateEntity extends FirestoreData {
    id: number;
    name: string;
    stateCode: string;
    latitude: string;
    longitude: string;
    type: string | null;
}
