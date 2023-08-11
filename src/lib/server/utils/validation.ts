import { ValidationError } from "$module/common/errors/validation";

import type Joi from "joi";

import { kebabCase } from "lodash-es";

export const validate = <T = unknown>(schema: Joi.ObjectSchema<T>, payload: T) => {
    const { error } = schema.validate(payload, {
        abortEarly: false,
    });

    const errors = error?.details.reduce(
        (err, { context, message }) => {
            err[kebabCase(context?.key) as string] = [message];

            return err;
        },
        {} as { [key: string]: string[] }
    );

    if (errors) {
        const invalidKeys = Object.keys(errors)
            .map((key) => `"${key}"`)
            .join(", ");

        return new ValidationError(`Invalid input: ${invalidKeys}`, errors);
    }
};
