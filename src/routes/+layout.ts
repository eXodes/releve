import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";

import { app } from "$client/utils/firebase";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data, setHeaders }) => {
    if (env.PUBLIC_RECAPTCHA_SITE_KEY && browser) {
        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true,
        });
    }

    return data;
};
