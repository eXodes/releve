import { DeliveryProvider } from "$features/delivery-providers/services";
import type { DeliveryProviderData } from "$features/delivery-providers/types";
import type { FetcherQuery } from "$client/utils/endpoint";

import { derived, writable, type Readable } from "svelte/store";

const createDeliveryProviderStore = () => {
    const _deliveryServices = writable<DeliveryProviderData[]>([]);

    const load = async (option?: FetcherQuery) => {
        DeliveryProvider.getAll(option).then((deliveryServices) => {
            _deliveryServices.set(deliveryServices);
        });
    };

    const deliveryServices: Readable<DeliveryProviderData[]> = derived(
        _deliveryServices,
        ($_deliveryServices, set) => {
            set($_deliveryServices);
        }
    );

    const { subscribe } = deliveryServices;

    return {
        subscribe,
        load,
    };
};

export const deliveryServices = createDeliveryProviderStore();
