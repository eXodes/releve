import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";

import { app } from "$client/utils/firebase";

import { getToken, initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data, setHeaders }) => {
    if (env.PUBLIC_RECAPTCHA_SITE_KEY && browser) {
        const appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true,
        });

        try {
            const appCheckResult = await getToken(appCheck, false);

            setHeaders({
                "X-Firebase-AppCheck": appCheckResult.token,
            });
        } catch {
            console.error("Unable to get Firebase App Check token.");
        }
    }

    return data;
};
