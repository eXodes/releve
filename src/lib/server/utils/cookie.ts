import { dev } from "$app/environment";

import { parse } from "cookie";

import type { CookieSerializeOptions } from "cookie";

export const SESSION_COOKIE = "__session";

export const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: !dev,
    sameSite: "strict",
};

export const getCookieValue = (headers: Headers, key: string) => {
    const cookies = parse(headers.get("cookie") || "");

    const cookieValue = cookies[key];

    if (!cookieValue) throw new Error(`No cookie value with the key [${key}] not found.`);

    return cookieValue;
};
