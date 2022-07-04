import type { RequestHandler } from "./__types";
import type { ShopStatus } from "$features/shops/enum";
import type { ErrorResponse } from "$types/response";

import { ShopCollection } from "$_collection/shops";
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
    status: ShopStatus;
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

    if (!userData.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const formData = await request.formData();

        const payload = getFormData<Payload>(formData);

        validate(schema, payload);

        const collection = new ShopCollection();

        const shopData = await collection.get(params.uid);

        await collection.set({
            uid: params.uid,
            name: payload.name,
            link: payload.link,
            categories: payload.categories,
            deliveryServices: payload.deliveryServices,
            address: {
                street: payload.streetAddress,
                city: payload.city,
                state: payload.state,
                postalCode: payload.postalCode,
                country: payload.country,
            },
            status: payload.status,
            createdAt: shopData.createdAt,
            createdBy: {
                uid: shopData.createdBy.uid,
                name: shopData.createdBy.name,
            },
        });

        return {
            status: 200,
            body: {
                message: 'Shop "' + payload.name + '" has been saved.',
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

export type DeleteOutput = {
    message: string;
};

export const del: RequestHandler<DeleteOutput> = async ({ params }) => {
    const collection = new ShopCollection();
    await collection.delete(params.uid);

    return {
        status: 200,
        body: {
            message: "Shop deleted.",
        },
    };
};
