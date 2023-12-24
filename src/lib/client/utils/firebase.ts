import { browser, dev } from "$app/environment";

import { firebaseConfig, firebaseEmulator } from "$client/config/firebase";
import { env } from "$env/dynamic/public";
import { type AppCheck } from "firebase/app-check";

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { connectAuthEmulator, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const setAuthPersistence = async () => {
    await setPersistence(auth, inMemoryPersistence);
};

setAuthPersistence();

let appCheck: AppCheck;

if (browser && env.PUBLIC_RECAPTCHA_SITE_KEY) {
    appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(env.PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
    });
}

if (dev || firebaseEmulator) connectAuthEmulator(auth, "http://localhost:9099");

export { app, auth, appCheck };
