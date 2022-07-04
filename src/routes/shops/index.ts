import type { RequestHandler } from "./__types";
import type { BaseEntity } from "$_model/database";
import type { ShopData } from "$_model/shop";
import type { MetaQuery, PaginationMeta } from "$types/meta";
import type { ErrorResponse } from "$types/response";

import { parse } from "qs";
import { Timestamp } from "firebase-admin/firestore";

import { ShopCollection } from "$_collection/shops";
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

        const { shops, meta } = await collection.getPaginated({
            offset: query.offset ? +query.offset : 0,
            limit: query.limit ? +query.limit : 30,
            orderBy: query.orderBy ?? "createdAt",
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

        validate(schema, { ...payload, status: payload.status ?? ShopStatus.PENDING });

        const collection = new ShopCollection();

        await collection.add({
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
            status: payload.status ?? ShopStatus.PENDING,
            createdAt: Timestamp.now(),
            createdBy: {
                uid: userData.uid,
                name: userData.displayName,
            },
        });

        const message =
            payload.status === ShopStatus.APPROVED
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
