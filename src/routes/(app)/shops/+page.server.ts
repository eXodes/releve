import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import type { MessageResponse } from "$client/types/response";
import { ShopStatus } from "$features/shops/enum";
import type { ShopData } from "$features/shops/types";
import { ShopCollection } from "$module/shop/shop.collection";
import { shopSchema } from "$module/shop/validation/shop.schema";
import { UserShopsCollection } from "$module/user/user-shops.collection";
import type { PaginationMeta, PaginationQuery, SearchQuery } from "$client/types/meta";
import { getFormData } from "$client/utils/data";

import { parse } from "qs";
import type { Actions, PageServerLoad } from "./$types";

export interface ShopsOutput {
    shops: ShopData[];
    meta?: PaginationMeta;
}

export const load: PageServerLoad<ShopsOutput> = async ({ locals, url, depends }) => {
    const session = locals.session;

    if (!session) {
        throw handleApiError(new Error("Not authenticated."));
    }

    if (!session.isAdmin) {
        throw handleApiError(new Error("Not authorized."));
    }

    try {
        const query = parse(url.searchParams.toString()) as PaginationQuery & SearchQuery;

        const { shops, meta } = await ShopCollection.getShops({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 20,
            orderBy: query.orderBy ?? "createdAt",
            search: query.search,
        });

        depends("shops");

        return {
            shops: shops.map((shop) => shop.data),
            meta,
        };
    } catch (error) {
        throw handleApiError(error);
    }
};

export type CreateShopPayload = {
    name: string;
    link: string;
    categories: string[];
    deliveryProviders: string[];
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    status?: ShopStatus;
    private: string;
};

export interface DeleteShopsPayload extends Record<string, string> {
    uids: string;
}

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new Error("Not authenticated."));
        }

        try {
            const formData = await request.formData();

            const payload = getFormData<CreateShopPayload>(formData);

            const isPrivate = payload.private === "true";

            validate(shopSchema, {
                ...payload,
                status: payload.status ?? ShopStatus.PENDING,
                private: isPrivate,
            });

            if (isPrivate) {
                await UserShopsCollection.createShop(session.data.uid, {
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
            } else {
                await ShopCollection.create({
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
                    status: payload.status ?? ShopStatus.PENDING,
                    createdBy: {
                        uid: session.data.uid,
                        name: session.data.displayName,
                    },
                });
            }

            const message =
                payload.status === ShopStatus.APPROVED || isPrivate
                    ? "Shop added successfully."
                    : "Shop has been submitted for approval.";

            return {
                message,
            } satisfies MessageResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    delete: async ({ request, locals }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new Error("Not authenticated."));
        }

        if (!session.isAdmin) {
            throw handleApiError(new Error("Not authorized."));
        }

        try {
            const formData = await request.formData();

            const { uids: stringUids } = getFormData<DeleteShopsPayload>(formData);

            const uids = stringUids.split(",");

            await ShopCollection.deleteAll(uids);

            return {
                message: "Shops deleted.",
            } satisfies MessageResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
