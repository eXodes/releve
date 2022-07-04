import type { GetOutput } from "$routes/delivery-services";
import type { ListData } from "$types/collection";
import type { FetchQuery } from "$types/meta";

import { endpoint } from "$utils/endpoint";

export const DeliveryService = {
    get: async (option?: FetchQuery): Promise<ListData[]> => {
        const { deliveryServices } = await endpoint<GetOutput>("/delivery-services", {
            method: "GET",
            fetch: option?.fetch,
        });

        return deliveryServices;
    },
};
