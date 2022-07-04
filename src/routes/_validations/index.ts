import type Joi from "joi";

import { kebabCase } from "lodash-es";

import { ValidationError } from "$routes/_errors/errors";

export const validate = <T = unknown>(schema: Joi.ObjectSchema<any>, payload: T) => {
    const { error } = schema.validate(payload, {
        abortEarly: false,
    });

    const errors = error?.details.reduce((err, { context, message }) => {
        err[kebabCase(context?.key) as string] = [message];

        return err;
    }, {} as { [key: string]: string[] });

    if (errors) {
        throw new ValidationError(JSON.stringify(errors));
    }
};
