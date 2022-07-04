import type { firestore } from "firebase-admin";
import type { MetaQuery, PaginationMeta } from "$types/meta";

export interface HasPagination<T> {
    getPaginationMeta: (
        snapshot: firestore.QuerySnapshot,
        meta: MetaQuery
    ) => Promise<PaginationMeta>;
    getPaginated: (
        query: MetaQuery
    ) => Promise<{ [key: string]: T[] | PaginationMeta; meta: PaginationMeta }>;
}

export interface HasCounter {
    getCount: () => Promise<number>;
    increaseCounter: () => Promise<void>;
    decreaseCounter: () => Promise<void>;
}
