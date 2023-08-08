import { handleApiError } from "$server/utils/error";
import { AuthError } from "$module/common/errors/auth";
import { UserShopsCollection } from "$module/user/user-shops.collection";

import type { ShopData } from "$features/shops/types";
import type { PaginationMeta, PaginationQuery } from "$client/types/meta";

import { parse } from "qs";

import type { PageServerLoad } from "./$types";

export interface MyShopsOutput {
    shops: ShopData[];
    meta?: PaginationMeta;
}

export const load: PageServerLoad<MyShopsOutput> = async ({ locals, url, depends }) => {
    const session = locals.session;

    const query = parse(url.searchParams.toString()) as PaginationQuery;

    if (!session) {
        throw handleApiError(new AuthError("Not authenticated.", 401));
    }

    try {
        const { shops, meta } = await UserShopsCollection.getUserShops(session.data.uid, {
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 15,
            orderBy: query.orderBy ?? "name",
            search: query.search,
        });

        depends("shops");

        return {
            shops: shops.map((shop) => shop.data),
            meta,
        };
    } catch (error) {
        throw handleApiError(error);
    }
};
