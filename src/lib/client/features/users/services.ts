import type { UserData } from "$features/users/types";
import { paginationQuery } from "$client/config/query";
import type { PaginationMeta, PaginationQuery } from "$client/types/meta";
import { endpoint, type FetcherQuery } from "$client/utils/endpoint";

export const UserService = {
    get: async (
        options?: FetcherQuery<PaginationQuery>
    ): Promise<{ users: UserData[]; meta: PaginationMeta }> => {
        const queryParams = new URLSearchParams({
            offset: String(options?.query?.offset ?? paginationQuery.offset),
            limit: String(options?.query?.limit ?? paginationQuery.limit),
            orderBy: options?.query?.orderBy ?? paginationQuery.orderBy,
        });

        return await endpoint<{ users: UserData[]; meta: PaginationMeta }>(
            `/users?${queryParams}`,
            {
                method: "GET",
                fetch: options?.fetch,
            }
        );
    },
    delete: async (uid: string): Promise<void> => {
        await endpoint(`/users/${uid}`, { method: "DELETE" });
    },
    deleteAll: async (uids: string[]): Promise<void> => {
        await endpoint<void, { uids: string[] }>("/users/bulk", {
            method: "DELETE",
            data: { uids },
        });
    },
};
