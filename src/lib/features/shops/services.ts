import type { Shop } from "$features/shops/types";
import type { Payload } from "$routes/shops/bulk";
import type { FetchQuery, PaginationMeta } from "$types/meta";

import { defaultQuery } from "$config/query";
import { endpoint } from "$utils/endpoint";

export const ShopService = {
    get: async (options?: FetchQuery): Promise<{ shops: Shop[]; meta: PaginationMeta }> => {
        const queryParams = new URLSearchParams({
            offset: String(options?.query?.offset ?? defaultQuery.offset),
            limit: String(options?.query?.limit ?? defaultQuery.limit),
            orderBy: options?.query?.orderBy ?? defaultQuery.orderBy,
        });

        return await endpoint<{ shops: Shop[]; meta: PaginationMeta }>(`/shops?${queryParams}`, {
            method: "GET",
            fetch: options?.fetch,
        });
    },
    delete: async (uid: string): Promise<void> => {
        await endpoint(`/shops/${uid}`, { method: "DELETE" });
    },
    deleteAll: async (uids: string[]): Promise<void> => {
        await endpoint<void, Payload>("/shops/bulk", {
            method: "DELETE",
            data: { uids },
        });
    },
};
