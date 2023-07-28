import { env } from "$env/dynamic/private";
import admin from "firebase-admin";
import { type App, applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App | undefined;

if (!admin.apps.length) {
    app = initializeApp({
        credential: applicationDefault(),
    });
}

if (app) {
    getFirestore(app).settings({
        ignoreUndefinedProperties: true,
    });
}

// eslint-disable-next-line no-console
console.log("[Service Account]: ", env.GOOGLE_APPLICATION_CREDENTIALS);
// eslint-disable-next-line no-console
console.log("[Firebase Admin]: ", admin.apps);
// eslint-disable-next-line no-console
console.log("[Firebase Admin Initialized]: ", app);

export default app;
