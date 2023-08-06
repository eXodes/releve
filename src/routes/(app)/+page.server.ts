import { ShopCollection } from "$module/shop/shop.collection";

import type { ShopData } from "$features/shops/types";
import type { PaginationMeta, PaginationQuery } from "$client/types/meta";

import { parse } from "qs";

import type { PageServerLoad } from "./$types";

export interface IndexOutput {
    shops: ShopData[];
    meta?: PaginationMeta;
}

export const load: PageServerLoad<IndexOutput> = async ({ url, depends }) => {
    const query = parse(url.searchParams.toString()) as PaginationQuery;

    try {
        const { shops, meta } = await ShopCollection.getApprovedShops({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 15,
            orderBy: query.orderBy ?? "name",
        });

        depends("shops:approved");

        return {
            shops: shops.map((shop) => shop.data),
            meta,
        };
    } catch (error) {
        return {
            shops: [],
            meta: undefined,
        };
    }
};
