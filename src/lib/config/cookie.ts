import type { CookieSerializeOptions } from "cookie";

import { dev } from "$app/env";

export const SESSION_COOKIE = "__session";

export const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: !dev,
    sameSite: "strict",
};
