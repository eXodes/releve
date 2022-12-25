import type { RequestHandler } from "./__types";
import type { BaseEntity } from "$_model/database";
import type { ShopData } from "$_model/shop";
import type { MetaQuery, PaginationMeta } from "$types/meta";
import type { ErrorResponse } from "$types/response";

import { parse } from "qs";

import { UserShopCollection } from "$_collection/user-shops";
import { handleError } from "$routes/_errors";

export interface GetOutput {
    shops: (BaseEntity & ShopData)[];
    meta: PaginationMeta;
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ url, locals }) => {
    const query = parse(url.searchParams.toString()) as unknown as MetaQuery;

    const userData = locals.user?.data();

    if (!userData) {
        return handleError(new Error("Not authorized."));
    }

    const collection = new UserShopCollection(userData.uid);

    try {
        const { shops, meta } = await collection.getShops({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 15,
            orderBy: query.orderBy ?? "name",
            search: query.search,
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
