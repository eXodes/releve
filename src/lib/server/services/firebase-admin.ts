import { env } from "$env/dynamic/private";
import admin from "firebase-admin";
import { type App, applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFile } from "fs";

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

readFile(env.GOOGLE_APPLICATION_CREDENTIALS as string, (err, data) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.error("[Service Account Error]: ", err);
    }

    // eslint-disable-next-line no-console
    console.log("[Service Account]: ", data.toString());
});

// eslint-disable-next-line no-console
console.log("[Service Account]: ");
// eslint-disable-next-line no-console
console.log("[Firebase Admin]: ", admin.apps);
// eslint-disable-next-line no-console
console.log("[Firebase Admin Initialized]: ", app);

// read from filesystem

// read from env

export default app;
