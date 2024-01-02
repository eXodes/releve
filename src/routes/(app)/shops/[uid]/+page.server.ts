import { UserCollection } from "$module/user/user.collection";
import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import { ShopCollection } from "$module/shop/shop.collection";
import { ShopStatusEmail } from "$module/shop/actions/email";
import { shopSchema } from "$module/shop/validation/shop.schema";
import { AuthError } from "$module/common/errors/auth";

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
            const shop = await ShopCollection.update({
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

            const user = await UserCollection.getUserByUid(shop.data.createdBy.uid);

            if (user) await shop.sendEmail(new ShopStatusEmail(shop, user));

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
