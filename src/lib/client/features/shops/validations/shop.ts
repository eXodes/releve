import type { ShopStatus } from "$features/shops/enum";
import isURL from "validator/lib/isURL";
import isAlphanumeric from "validator/lib/isAlphanumeric";

import { create, enforce, only, test } from "vest";

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
};

enforce.extend({
    isURL: isURL,
    isAlphanumeric: isAlphanumeric,
});

const shopSuite = create(
    (
        { name, link, categories, deliveryProviders, streetAddress, city, postalCode }: ShopPayload,
        field?: string
    ) => {
        only(field);

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

export default shopSuite;
