import { browser, dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import { PUBLIC_APP_ENV } from "$env/static/public";

import { firebaseConfig, firebaseEmulator } from "$client/config/firebase";

import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";
import { initializePerformance, type FirebasePerformance } from "firebase/performance";
import { initializeAnalytics, type Analytics } from "firebase/analytics";

const isDeployment = ["preview", "production"].includes(PUBLIC_APP_ENV);

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const setAuthPersistence = async () => {
    await setPersistence(auth, inMemoryPersistence);
};

setAuthPersistence();

let appCheck: AppCheck | undefined;
let performance: FirebasePerformance | undefined;
let analytics: Analytics | undefined;

if (isDeployment && browser) {
    if (env.PUBLIC_RECAPTCHA_SITE_KEY)
        appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_SITE_KEY),
            isTokenAutoRefreshEnabled: true,
        });

    performance = initializePerformance(app);

    analytics = initializeAnalytics(app);
}

if (dev || firebaseEmulator) connectAuthEmulator(auth, "http://localhost:9099");

export { app, auth, appCheck, performance, analytics };
