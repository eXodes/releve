import { handleApiError } from "$server/utils/error";
import type { DeliveryProviderData } from "$features/delivery-providers/types";
import { DeliveryProviderCollection } from "$module/delivery-provider/delivery-provider.collection";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export interface DeliveryServiceGetOutput {
    deliveryServices: DeliveryProviderData[];
}

export const GET: RequestHandler = async ({ locals }) => {
    const user = locals.session;

    if (!user) {
        throw handleApiError(new Error("Not authenticated."));
    }

    try {
        const deliveryServices = await DeliveryProviderCollection.getDeliveryProviders();

        return json({
            deliveryServices: deliveryServices.map((deliveryService) => deliveryService.data),
        } satisfies DeliveryServiceGetOutput);
    } catch (error) {
        throw handleApiError(error);
    }
};
