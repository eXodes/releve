import { dev } from "$app/environment";

import type { CookieSerializeOptions } from "cookie";

export const SESSION_COOKIE = "__session";

export const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: !dev,
    sameSite: "strict",
};
