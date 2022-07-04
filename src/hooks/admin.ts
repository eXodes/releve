import admin from "firebase-admin";
import { type App, applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { dev } from "$app/env";
import { getFile } from "$utils/file-system";

if (dev) {
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099";
    process.env["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080";
    process.env["FIREBASE_STORAGE_EMULATOR_HOST"] = "127.0.0.1:9199";
    process.env["FUNCTIONS_EMULATOR"] = "true";
}

let app: App | undefined;

if (!admin.apps.length) {
    const credentialFile = dev && getFile(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const credential = credentialFile ? cert(JSON.parse(credentialFile)) : undefined;

    app = initializeApp({
        credential: dev ? (credentialFile ? credential : undefined) : applicationDefault(),
    });
}

getAuth(app);
getFirestore(app).settings({
    ignoreUndefinedProperties: true,
});
getStorage(app);

export default app;
