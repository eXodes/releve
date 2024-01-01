import { Role } from "$features/users/enum";
import type { UserData } from "$features/users/types";

import validator from "validator";
import { create, enforce, include, only, optional, test } from "vest";

export type UpdateUserPayload = {
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

export type UpdateUserResponse = {
    user: UserData;
};

enforce.extend({
    isEmail: validator.isEmail,
    isAlpha: validator.isAlpha,
    isAlphanumeric: validator.isAlphanumeric,
});

export const updateUserSuite = create(
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
        }: UpdateUserPayload,
        field?: string
    ) => {
        only(field);
        include("confirm-password").when("password");

        optional({
            "role": () => !role,
            "user-photo": () => true,
            "first-name": () => true,
            "last-name": () => true,
            "street-address": () => true,
            "city": () => true,
            "postal-code": () => true,
            "private": () => true,
        });

        test("display-name", "Display name is required.", () => {
            enforce(displayName).isNotBlank();
        });

        test("role", "Role is not valid.", () => {
            enforce(role).inside([Role.ADMIN, Role.USER]);
        });

        test("about", "About cannot exceed 200 characters.", () => {
            enforce(about.length).lessThanOrEquals(250);
        });

        test("user-photo", "Photo must be image.", () => {
            enforce(userPhoto?.type).isNotValueOf(["image/png", "image/jpeg"]);
        });

        test("first-name", "First name must be valid name.", () => {
            enforce(firstName).isAlpha("en-US", { ignore: " -" });
        });

        test("last-name", "Last name must be valid name.", () => {
            enforce(lastName).isAlpha("en-US", { ignore: " -" });
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
