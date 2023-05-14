import { Role } from "$features/users/enum";
import type { UpdateUserPayload } from "$features/users/validations/update-user";
import Joi from "joi";

export const updateAccountSchema = Joi.object<UpdateUserPayload>({
    displayName: Joi.string().optional().messages({
        "string.empty": "Display name is required.",
        "string.base": "Display name must be a string.",
    }),
    role: Joi.string().optional().valid(Role.ADMIN, Role.USER).messages({
        "string.empty": "Role is required.",
        "string.base": "Role must be a string.",
    }),
    about: Joi.string().optional().allow("").max(200).messages({
        "string.base": "About must be a string.",
        "string.max": "About must be less than 200 characters.",
    }),
    userPhoto: Joi.object().optional().allow("").max(200).messages({
        "string.base": "About must be a string.",
        "string.max": "About must be less than 200 characters.",
    }),
    email: Joi.string().optional().email().messages({
        "string.empty": "Email is required.",
        "string.email": "Email must be a valid email address.",
    }),
    phoneNumber: Joi.string().optional().allow("").messages({
        "string.base": "Phone number be a string.",
    }),
    firstName: Joi.string().optional().allow("").messages({
        "string.base": "First name must be a string.",
    }),
    lastName: Joi.string().optional().allow("").messages({
        "string.base": "Last name must be a string.",
    }),
    streetAddress: Joi.string().optional().allow("").messages({
        "string.base": "Street address must be a string.",
    }),
    city: Joi.string().optional().allow("").messages({
        "string.base": "City must be a string.",
    }),
    state: Joi.string().optional().allow("").messages({
        "string.base": "State must be a string.",
    }),
    postalCode: Joi.string().optional().allow("").messages({
        "string.base": "Postal code must be a string.",
    }),
    country: Joi.string().optional().allow("").messages({
        "string.base": "Country must be a string.",
    }),
});
