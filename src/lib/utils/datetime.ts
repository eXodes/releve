import { format, formatDistanceToNow, intlFormat } from "date-fns";

export const getISODatetime = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

export const getFullDatetime = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "yyyy-MM-dd HH:mm:ss", {
        locale: {
            code: navigator.language,
        },
    });
};

export const getLocaleDatetime = (dateString: string) => {
    const date = new Date(dateString);

    return intlFormat(date, {
        localeMatcher: "lookup",
        formatMatcher: "best fit",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
export const getRelativeDatetime = (dateString: string) => {
    const date = new Date(dateString);

    return formatDistanceToNow(date, {
        addSuffix: true,
    });
};

export const getPlainDate = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "yyyy-MM-dd");
};
