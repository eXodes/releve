import { handleApiError } from "$server/utils/error";
import { AuthError } from "$module/common/errors/auth";
import { ShopCollection } from "$module/shop/shop.collection";

import type { ShopData } from "$features/shops/types";
import type { PaginationMeta, PaginationQuery, SearchQuery } from "$client/types/meta";

import { parse } from "qs";

import type { PageServerLoad } from "./$types";

export interface ShopsOutput {
    shops: ShopData[];
    meta?: PaginationMeta;
}

export const load: PageServerLoad<ShopsOutput> = async ({ locals, url, depends }) => {
    const session = locals.session;

    if (!session) {
        throw handleApiError(new AuthError("Not authenticated.", 401));
    }

    try {
        const query = parse(url.searchParams.toString()) as PaginationQuery & SearchQuery;

        const { shops, meta } = await ShopCollection.getShopsByUser({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 20,
            orderBy: query.orderBy ?? "createdAt",
            search: query.search,
            uid: session.data.uid,
        });

        depends("shops:pending");

        return {
            shops: shops.map((shop) => shop.data),
            meta,
        };
    } catch (error) {
        throw handleApiError(error);
    }
};
