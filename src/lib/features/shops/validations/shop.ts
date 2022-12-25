import validator from "validator";
import { create, enforce, only, test } from "vest";

export interface UpdateShopDto {
    name: string;
    link: string;
    categories: string;
    deliveryServices: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    status?: string;
    private: boolean;
}

enforce.extend({
    isURL: validator.isURL,
    isAlphanumeric: validator.isAlphanumeric,
});

const suite = create(
    (
        {
            name,
            link,
            categories,
            deliveryServices,
            streetAddress,
            city,
            postalCode,
        }: UpdateShopDto,
        field?: string
    ) => {
        only(field);

        test("name", "Display name is required.", () => {
            enforce(name).isNotBlank();
        });

        test("link", "Link is required.", () => {
            enforce(name).isNotBlank();
        });

        test("link", "Link is not a valid URL.", () => {
            enforce(link).isURL();
        });

        test("categories[]", "Categories is required.", () => {
            enforce(categories).isNotBlank();
        });

        test("delivery-services[]", "Delivery services is required.", () => {
            enforce(deliveryServices).isNotBlank();
        });

        test("street-address", "Street address is not valid.", () => {
            enforce(streetAddress).isAlphanumeric("en-US", { ignore: " -," });
        });

        test("city", "City is not valid.", () => {
            enforce(city).isAlphanumeric("en-US", { ignore: " -," });
        });

        test("postal-code", "Postal code is not valid.", () => {
            enforce(postalCode).matches(/^([A-Z|\d]+[-\s])*[A-Z|\d]*$/);
        });
    }
);

export default suite;
