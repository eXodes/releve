import type { RequestHandler } from "./__types";
import type { BaseEntity } from "$_model/database";
import type { ShopData } from "$_model/shop";
import type { MetaQuery, PaginationMeta } from "$types/meta";

import { parse } from "qs";

import { ShopCollection } from "$_collection/shops";
import { ShopStatus } from "$features/shops/enum";

export interface GetOutput {
    shops: (BaseEntity & ShopData)[];
    meta: PaginationMeta;
}

export const get: RequestHandler<GetOutput> = async ({ url }) => {
    const query = parse(url.searchParams.toString()) as unknown as MetaQuery;

    const collection = new ShopCollection();

    try {
        const { shops, meta } = await collection.getPaginated({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 15,
            orderBy: query.orderBy ?? "name",
            status: ShopStatus.APPROVED,
        });

        return {
            status: 200,
            body: {
                shops,
                meta,
            },
        };
    } catch (e) {
        return {
            status: 200,
            body: {
                shops: [],
                meta: {
                    total: null,
                    previous: null,
                    next: null,
                },
            },
        };
    }
};
