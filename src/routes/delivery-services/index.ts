import type { RequestHandler } from "./__types";
import type { ListData } from "$types/collection";
import type { ErrorResponse } from "$types/response";

import { DeliveryServiceCollection } from "$_collection/delivery-services";
import { handleError } from "$routes/_errors";

export interface GetOutput {
    deliveryServices: ListData[];
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    try {
        const deliveryServiceCollection = new DeliveryServiceCollection();

        const deliveryServices = await deliveryServiceCollection.getSortedDeliveryServices();

        return {
            status: 200,
            body: {
                deliveryServices,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
