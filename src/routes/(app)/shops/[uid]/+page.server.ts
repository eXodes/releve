import type { ShopPayload } from "$features/shops/validations/shop";
import { ShopCollection } from "$module/shop/shop.collection";
import { shopSchema } from "$module/shop/validation/shop.schema";
import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import { getFormData } from "$client/utils/data";

import type { Actions } from "./$types";

export interface UpdateShopOutput {
    message: string;
}

export interface DeleteShopOutput {
    message: string;
}

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new Error("Not authenticated."));
        }

        if (!session.isAdmin) {
            throw handleApiError(new Error("Not authorized."));
        }

        try {
            const formData = await request.formData();

            const payload = getFormData<ShopPayload>(formData);

            validate(shopSchema, payload);

            await ShopCollection.update({
                uid: params.uid,
                name: payload.name,
                link: payload.link,
                categories: payload.categories,
                deliveryProviders: payload.deliveryProviders,
                address: {
                    street: payload.streetAddress,
                    city: payload.city,
                    state: payload.state,
                    postalCode: payload.postalCode,
                    country: payload.country,
                },
                status: payload.status,
            });

            return {
                message: payload.name + " shop has been saved.",
            } satisfies UpdateShopOutput;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    delete: async ({ locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new Error("Not authenticated."));
        }

        if (!session.isAdmin) {
            throw handleApiError(new Error("Not authorized."));
        }

        try {
            await ShopCollection.delete(params.uid);

            return {
                message: "Shop deleted.",
            } satisfies DeleteShopOutput;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
