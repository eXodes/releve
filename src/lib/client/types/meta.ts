export interface MetaQuery {
    [key: string]: unknown;
}

export interface PaginationQuery extends MetaQuery {
    offset: number;
    limit: number;
    orderBy: string;
}

export interface SearchQuery extends MetaQuery {
    search?: string;
}

export interface PaginationMeta {
    total: number;
    previous: PaginationQuery | null;
    next: PaginationQuery | null;
}
