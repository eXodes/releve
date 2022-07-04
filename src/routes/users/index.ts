import type { RequestHandler } from "./__types";
import type { UserData } from "$_model/user";
import type { MetaQuery, PaginationMeta } from "$types/meta";
import type { ErrorResponse } from "$types/response";

import { parse } from "qs";

import { UserCollection } from "$_collection/users";
import { handleError } from "$routes/_errors";

export interface GetOutput {
    users: UserData[];
    meta: PaginationMeta;
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ locals, url }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    if (!userData.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const query = parse(url.searchParams.toString()) as unknown as MetaQuery;

        const collection = new UserCollection();

        const { users, meta } = await collection.getPaginated({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 20,
            orderBy: query.orderBy ?? "createdAt",
            search: query.search,
        });

        return {
            status: 200,
            body: {
                users,
                meta,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
