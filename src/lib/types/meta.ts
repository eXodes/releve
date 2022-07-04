import type { Fetch } from "$utils/endpoint";

export interface MetaQuery {
    [key: string]: string | number | undefined;
    orderBy: string;
    offset: number;
    limit: number;
}

export interface PaginationData {
    offset: number;
    limit: number;
    orderBy: string;
}

export interface PaginationMeta {
    total: number | null;
    previous: string | null;
    next: string | null;
}

export interface FetchQuery {
    query?: MetaQuery;
    fetch?: Fetch;
}

export interface EnumType {
    [key: string]: string | number;
}
