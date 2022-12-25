import type { RequestHandler } from "./__types/[uid]";
import type { ShopStatus } from "$features/shops/enum";
import type { ErrorResponse } from "$types/response";

import { UserShopCollection } from "$_collection/user-shops";
import { handleError } from "$routes/_errors";
import { validate } from "$routes/_validations";
import { schema } from "$routes/_validations/shops/shop.schema";
import { getFormData } from "$utils/data";

export type Payload = {
    name: string;
    link: string;
    categories: string[];
    deliveryServices: string[];
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    status?: ShopStatus;
};

export interface PatchOutput {
    message: string;
}

export const patch: RequestHandler<PatchOutput | ErrorResponse> = async ({
    request,
    locals,
    params,
}) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    try {
        const formData = await request.formData();

        const payload = getFormData<Payload>(formData);

        const payloadData = {
            ...payload,
            private: true,
        };

        validate(schema, payloadData);

        const collection = new UserShopCollection(userData.uid);

        await collection.set({
            uid: params.uid,
            name: payloadData.name,
            link: payloadData.link,
            categories: payloadData.categories,
            deliveryServices: payloadData.deliveryServices,
            address: {
                street: payloadData.streetAddress,
                city: payloadData.city,
                state: payloadData.state,
                postalCode: payloadData.postalCode,
                country: payloadData.country,
            },
            status: payloadData.status,
        });

        return {
            status: 200,
            body: {
                message: payload.name + " shop has been saved.",
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

export type DeleteOutput = {
    message: string;
};

export const del: RequestHandler<DeleteOutput | ErrorResponse> = async ({ locals, params }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    const collection = new UserShopCollection(userData.uid);
    await collection.delete(params.uid);

    return {
        status: 200,
        body: {
            message: "Shop deleted.",
        },
    };
};
