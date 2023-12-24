import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";

import { firebaseEmulator } from "$client/config/firebase";
import { app } from "$client/utils/firebase";

import type { AppCheckTokenResult } from "@firebase/app-check";
import { getToken, initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data, setHeaders }) => {
    if (!(dev || firebaseEmulator)) {
        let appCheckResult: AppCheckTokenResult;

        const appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true,
        });

        try {
            appCheckResult = await getToken(appCheck, false);

            setHeaders({
                "X-Firebase-AppCheck": appCheckResult.token,
            });
        } catch {
            console.error("Unable to get Firebase App Check token.");
        }
    }

    return data;
};
