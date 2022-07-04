import type { Readable } from "svelte/store";
import type { ListData } from "$types/collection";
import type { FetchQuery } from "$types/meta";

import { derived, writable } from "svelte/store";

import { DeliveryService } from "$features/delivery-services/services";

const createDeliveryServiceStore = () => {
    const _deliveryServices = writable<ListData[]>([]);

    const load = async (option?: FetchQuery) => {
        DeliveryService.get(option).then((deliveryServices) => {
            _deliveryServices.set(deliveryServices);
        });
    };

    const deliveryServices: Readable<ListData[]> = derived(
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

export const deliveryServices = createDeliveryServiceStore();
