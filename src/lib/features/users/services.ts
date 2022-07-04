import type { User } from "$features/users/types";
import type { Payload } from "$routes/users/bulk";
import type { FetchQuery, PaginationMeta } from "$types/meta";

import { defaultQuery } from "$config/query";
import { endpoint } from "$utils/endpoint";

export const UserService = {
    get: async (options?: FetchQuery): Promise<{ users: User[]; meta: PaginationMeta }> => {
        const queryParams = new URLSearchParams({
            offset: String(options?.query?.offset ?? defaultQuery.offset),
            limit: String(options?.query?.limit ?? defaultQuery.limit),
            orderBy: options?.query?.orderBy ?? defaultQuery.orderBy,
        });

        return await endpoint<{ users: User[]; meta: PaginationMeta }>(`/users?${queryParams}`, {
            method: "GET",
            fetch: options?.fetch,
        });
    },
    delete: async (uid: string): Promise<void> => {
        await endpoint(`/users/${uid}`, { method: "DELETE" });
    },
    deleteAll: async (uids: string[]): Promise<void> => {
        await endpoint<void, Payload>("/users/bulk", {
            method: "DELETE",
            data: { uids },
        });
    },
};
