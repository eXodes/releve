import type { DeliveryProviderData } from "$features/delivery-providers/types";
import type { FetcherQuery } from "$client/utils/endpoint";
import { endpoint } from "$client/utils/endpoint";

export const DeliveryProvider = {
    getAll: async (option?: FetcherQuery): Promise<DeliveryProviderData[]> => {
        const { deliveryServices } = await endpoint<{ deliveryServices: DeliveryProviderData[] }>(
            "/delivery-providers",
            {
                method: "GET",
                fetch: option?.fetch,
            }
        );

        return deliveryServices;
    },
};
