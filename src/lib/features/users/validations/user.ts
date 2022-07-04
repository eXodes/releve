import { create, test, enforce, only, include, omitWhen } from "vest";
import validator from "validator";

import { Role } from "$features/users/enum";

export type UpdateUserDto = {
    displayName: string;
    role?: Role;
    about: string;
    userPhoto?: File;
    firstName: string;
    lastName: string;
    email: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

enforce.extend({
    isEmail: validator.isEmail,
    isAlpha: validator.isAlpha,
    isAlphanumeric: validator.isAlphanumeric,
});

const suite = create(
    (
        {
            displayName,
            role,
            about,
            userPhoto,
            firstName,
            lastName,
            streetAddress,
            city,
            postalCode,
        }: UpdateUserDto,
        field?: string
    ) => {
        only(field);
        include("confirm-password").when("password");

        test("display-name", "Display name is required.", () => {
            enforce(displayName).isNotBlank();
        });

        omitWhen(!role, () => {
            test("role", "Role is not valid.", () => {
                enforce(role).inside([Role.ADMIN, Role.USER]);
            });
        });

        test("about", "About cannot exceed 200 characters.", () => {
            enforce(about.length).lessThanOrEquals(250);
        });

        omitWhen(!userPhoto?.type, () => {
            test("user-photo", "Photo must be image.", () => {
                enforce(userPhoto?.type).isNotValueOf(["image/png", "image/jpeg"]);
            });
        });

        omitWhen(!firstName, () => {
            test("first-name", "First name must be valid name.", () => {
                enforce(firstName).isAlpha("en-US", { ignore: " -" });
            });
        });

        omitWhen(!lastName, () => {
            test("last-name", "Last name must be valid name.", () => {
                enforce(lastName).isAlpha("en-US", { ignore: " -" });
            });
        });

        omitWhen(!streetAddress, () => {
            test("street-address", "Street address is not valid.", () => {
                enforce(streetAddress).isAlphanumeric("en-US", { ignore: " -," });
            });
        });

        omitWhen(!city, () => {
            test("city", "City is not valid.", () => {
                enforce(city).isAlphanumeric("en-US", { ignore: " -," });
            });
        });

        omitWhen(!postalCode, () => {
            test("postal-code", "Postal code is not valid.", () => {
                enforce(postalCode).matches(/^([A-Z|\d]+[-\s])*[A-Z|\d]*$/);
            });
        });
    }
);

export default suite;
