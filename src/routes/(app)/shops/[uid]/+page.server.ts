import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import { AuthError } from "$module/common/errors/auth";
import { ShopCollection } from "$module/shop/shop.collection";
import { shopSchema } from "$module/shop/validation/shop.schema";

import type { ShopPayload } from "$features/shops/validations/shop";
import { getFormData } from "$client/utils/data";
import type { MessageResponse } from "$client/types/response";

import type { Actions } from "./$types";

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new AuthError("Not authenticated.", 401));
        }

        if (!session.isAdmin) {
            throw handleApiError(new AuthError("Not authorized.", 403));
        }

        const formData = await request.formData();

        const payload = getFormData<ShopPayload>(formData);

        const errors = validate(shopSchema, payload);

        if (errors) {
            return handleApiError(errors);
        }

        try {
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
            } satisfies MessageResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    delete: async ({ locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new AuthError("Not authenticated.", 401));
        }

        if (!session.isAdmin) {
            throw handleApiError(new AuthError("Not authorized.", 403));
        }

        try {
            await ShopCollection.delete(params.uid);

            return {
                message: "Shop deleted.",
            } satisfies MessageResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
