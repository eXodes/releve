import type { FirestoreQueryDocSnapshot } from "$server/type/firestore";

import type { PaginationMeta, PaginationQuery } from "$client/types/meta";

export abstract class HasPagination<Entity> {
    getPaginationMeta: (
        last: FirestoreQueryDocSnapshot<Entity>,
        query: PaginationQuery
    ) => Promise<PaginationMeta>;
    getPaginated: (
        query: PaginationQuery
    ) => Promise<{ [key: string]: Entity[] | PaginationMeta | undefined; meta?: PaginationMeta }>;
}

export interface Paginated {
    meta?: PaginationMeta;
}
