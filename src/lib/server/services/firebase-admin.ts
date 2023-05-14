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

export default app;
