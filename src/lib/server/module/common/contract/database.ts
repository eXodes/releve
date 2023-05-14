import type { FirestoreValue } from "$server/type/firestore";

export interface BaseEntity {
    uid: string;
}

export abstract class FirestoreDatabase<Entity> {
    protected abstract add(value: FirestoreValue<Entity>): Promise<Entity | undefined>;
    protected abstract set(value: BaseEntity & FirestoreValue<Entity>): Promise<void>;
    protected abstract get(uid: BaseEntity["uid"]): Promise<Entity | undefined>;
    protected abstract getAll(): Promise<Entity[]>;
    protected abstract delete(uid: BaseEntity["uid"]): Promise<void>;
}
