import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";

import { app } from "$client/utils/firebase";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
    if (browser && env.PUBLIC_RECAPTCHA_SITE_KEY) {
        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true,
        });
    }

    return data;
};
