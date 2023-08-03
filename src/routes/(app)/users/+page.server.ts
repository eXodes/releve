import type { MessageResponse } from "$client/types/response";
import { getFormData } from "$client/utils/data";
import type { UserData } from "$features/users/types";
import { UserCollection } from "$module/user/user.collection";
import { handleApiError } from "$server/utils/error";
import type { PaginationMeta, PaginationQuery, SearchQuery } from "$client/types/meta";

import { parse } from "qs";

import type { Actions, PageServerLoad } from "./$types";

export interface UsersOutput {
    users: UserData[];
    meta?: PaginationMeta;
}

export interface DeleteUsersPayload extends Record<string, string> {
    uids: string;
}

export const load: PageServerLoad<UsersOutput> = async ({ locals, url, depends }) => {
    const session = locals.session;

    if (!session) {
        throw handleApiError(new Error("Not authenticated."));
    }

    if (!session.isAdmin) {
        throw handleApiError(new Error("Not authorized."));
    }

    try {
        const query = parse(url.searchParams.toString()) as PaginationQuery & SearchQuery;

        const { users, meta } = await UserCollection.getUsers({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 20,
            orderBy: query.orderBy ?? "createdAt",
            search: query.search,
        });

        depends("users");

        return {
            users: users.map((user) => user.data),
            meta,
        } satisfies UsersOutput;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const actions: Actions = {
    delete: async ({ request, locals }) => {
        const user = locals.session;

        if (!user) {
            throw handleApiError(new Error("Not authenticated."));
        }

        if (!user.isAdmin) {
            throw handleApiError(new Error("Not authorized."));
        }

        const formData = await request.formData();

        const { uids: stringUids } = getFormData<DeleteUsersPayload>(formData);

        if (!stringUids) {
            throw handleApiError(new Error("User IDs not provided."));
        }

        const uids = stringUids.split(",");

        try {
            await UserCollection.deleteAll(uids);

            return {
                message: "Users deleted.",
            } satisfies MessageResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
