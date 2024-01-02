import { ShopStatus } from "$features/shops/enum";

import Joi from "joi";
import isURL from "validator/lib/isURL";

export const shopSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required.",
        "string.base": "Name must be a string.",
    }),
    link: Joi.string()
        .required()
        .messages({
            "any.required": "Link is required.",
            "string.base": "Link must be a string.",
        })
        .custom((value, helpers) => {
            if (!isURL(value, {})) {
                helpers.message({
                    custom: "Link must be a valid URL.",
                });
            }
        }),
    categories: Joi.array()
        .items(
            Joi.string().required().messages({
                "any.required": "Category name is required.",
            })
        )
        .required()
        .messages({
            "any.required": "Categories is required.",
            "array.base": "Categories must be an array.",
        }),
    deliveryProviders: Joi.array()
        .items(
            Joi.string().required().messages({
                "any.required": "Delivery name is required.",
            })
        )
        .required()
        .messages({
            "any.required": "Deliveries is required.",
            "array.base": "Deliveries must be an array.",
        }),
    streetAddress: Joi.string().messages({
        "any.required": "Street address is required.",
        "string.base": "Street address must be a string.",
    }),
    city: Joi.string().required().messages({
        "any.required": "City is required.",
        "string.base": "City must be a string.",
    }),
    state: Joi.string().messages({
        "any.required": "State is required.",
        "string.base": "State must be a string.",
    }),
    postalCode: Joi.string().required().messages({
        "any.required": "Postal code is required.",
        "string.base": "Postal code must be a string.",
    }),
    country: Joi.string().required().messages({
        "any.required": "Country is required.",
        "string.base": "Country must be a string.",
    }),
    status: Joi.string().when("private", {
        is: false,
        then: Joi.required()
            .valid(ShopStatus.PENDING, ShopStatus.APPROVED, ShopStatus.REJECTED)
            .messages({
                "any.required": "Status is required.",
                "any.only": `Status must be one of "${ShopStatus.PENDING}", "${ShopStatus.APPROVED}", or "${ShopStatus.PENDING}".`,
                "string.base": "Status must be a string.",
            }),
    }),
    private: Joi.boolean().messages({
        "any.required": "Private is required.",
        "boolean.base": "Private must be a boolean.",
    }),
});
