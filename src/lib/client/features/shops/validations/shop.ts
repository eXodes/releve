import type { ShopStatus } from "$features/shops/enum";
import { Role } from "$features/users/enum";
import isURL from "validator/lib/isURL";
import isAlphanumeric from "validator/lib/isAlphanumeric";

import { create, enforce, only, optional, test } from "vest";

export type ShopPayload = {
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
    private?: "true" | "false";
    role: Role;
};

enforce.extend({
    isURL: isURL,
    isAlphanumeric: isAlphanumeric,
});

export const shopSuite = create(
    (
        {
            name,
            link,
            categories,
            deliveryProviders,
            streetAddress,
            city,
            postalCode,
            status,
            private: isPrivate,
            role,
        }: ShopPayload,
        field?: string
    ) => {
        only(field);

        const skipStatus = isPrivate === "true" || role === Role.USER;

        optional({
            "street-address": () => true,
            "private": () => true,
            "status": () => skipStatus,
        });

        test("name", "Display name is required.", () => {
            enforce(name).isNotBlank();
        });

        test("link", "Link is required.", () => {
            enforce(link).isNotBlank();
        });

        test("link", "Link is not a valid URL.", () => {
            enforce(link).isURL({});
        });

        test("link", "URL doesn't require a protocol.", () => {
            enforce(link).notMatches(/^https?:\/\/.+/);
        });

        test("categories[]", "Categories is required.", () => {
            enforce(categories).isNotBlank();
        });

        test("delivery-providers[]", "Delivery services is required.", () => {
            enforce(deliveryProviders).isNotBlank();
        });

        test("status", "Status is required.", () => {
            enforce(status).isNotBlank();
        });

        test("street-address", "Street address is not valid.", () => {
            enforce(streetAddress).isAlphanumeric("en-US", { ignore: " -,/." });
        });

        test("city", "City is not valid.", () => {
            enforce(city).isAlphanumeric("en-US", { ignore: " -," });
        });

        test("postal-code", "Postal code is not valid.", () => {
            enforce(postalCode).matches(/^([A-Z|\d]+[-\s])*[A-Z|\d]*$/);
        });
    }
);
