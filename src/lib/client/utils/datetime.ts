import { format, formatDistanceToNow, intlFormat } from "date-fns";

export const getISODatetime = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

export const getFullDatetime = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    return format(date, "yyyy-MM-dd HH:mm:ss", {
        locale: {
            code: navigator.language,
        },
    });
};

export const getLocaleDatetime = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    return intlFormat(date, {
        localeMatcher: "lookup",
        formatMatcher: "best fit",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
export const getRelativeDatetime = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    return formatDistanceToNow(date, {
        addSuffix: true,
    });
};

export const getPlainDate = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);

    return format(date, "yyyy-MM-dd");
};
