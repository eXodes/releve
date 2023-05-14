import Joi from "joi";

export const updatePasswordSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"))
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.pattern.base":
                "Password must contain at least one number, one lowercase and one uppercase letter, and at least 8 or more characters.",
        }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
        "any.only": "Password and confirm password mismatch.",
    }),
});
