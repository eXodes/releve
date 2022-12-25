import type { RequestHandler } from "./__types";
import type { BaseEntity } from "$_model/database";
import type { ShopData } from "$_model/shop";
import type { MetaQuery, PaginationMeta } from "$types/meta";
import type { ErrorResponse } from "$types/response";

import { Timestamp } from "firebase-admin/firestore";
import { parse } from "qs";

import { ShopCollection } from "$_collection/shops";
import { UserShopCollection } from "$_collection/user-shops";
import { ShopStatus } from "$features/shops/enum";
import { handleError } from "$routes/_errors";
import { validate } from "$routes/_validations";
import { schema } from "$routes/_validations/shops/shop.schema";
import { getFormData } from "$utils/data";

export interface GetOutput {
    shops: (BaseEntity & ShopData)[];
    meta: PaginationMeta;
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ locals, url }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    if (!userData.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const query = parse(url.searchParams.toString()) as unknown as MetaQuery;

        const collection = new ShopCollection();

        const { shops, meta } = await collection.getShops({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 30,
            orderBy: query.orderBy ?? "createdAt",
            search: query.search,
        });

        return {
            status: 200,
            body: {
                shops,
                meta,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

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
    private: string;
};

export interface PostOutput {
    message: string;
}

export const post: RequestHandler<PostOutput | ErrorResponse> = async ({ request, locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    try {
        const formData = await request.formData();

        const payload = getFormData<Payload>(formData);

        const isPrivate = payload.private === "true";

        const payloadData = {
            ...payload,
            status: isPrivate ? undefined : payload.status ?? ShopStatus.PENDING,
            private: isPrivate,
        };

        validate(schema, payloadData);

        const collection = isPrivate ? new UserShopCollection(userData.uid) : new ShopCollection();

        await collection.add({
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
            createdAt: Timestamp.now(),
            createdBy: {
                uid: userData.uid,
                name: userData.displayName,
            },
        });

        const message =
            payload.status === ShopStatus.APPROVED || isPrivate
                ? "Shop added successfully."
                : "Shop has been submitted for approval.";

        return {
            status: 200,
            body: {
                message,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
