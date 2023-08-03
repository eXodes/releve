import type { MessageResponse } from "$client/types/response";
import { getFormData } from "$client/utils/data";
import { shopSchema } from "$module/shop/validation/shop.schema";
import { UserShopsCollection } from "$module/user/user-shops.collection";
import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import type { Actions } from "./$types";

export type UpdateUserShopPayload = {
    name: string;
    link: string;
    categories: string[];
    deliveryProviders: string[];
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new Error("Not authenticated."));
        }

        const shop = await UserShopsCollection.getUserShop(session.data.uid, params.uid);

        if (session.data.uid !== shop.data.createdBy.uid) {
            throw handleApiError(new Error("Not authorized."));
        }

        try {
            const formData = await request.formData();

            const payload = getFormData<UpdateUserShopPayload>(formData);

            validate(shopSchema, {
                ...payload,
                private: true,
            });

            await UserShopsCollection.updateShop(session.data.uid, {
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
                createdBy: {
                    uid: session.data.uid,
                    name: session.data.displayName,
                },
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
            throw handleApiError(new Error("Not authenticated."));
        }

        try {
            await UserShopsCollection.deleteShop(session.data.uid, params.uid);

            return {
                message: "Shop deleted.",
            } satisfies MessageResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
