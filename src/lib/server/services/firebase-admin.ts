import admin from "firebase-admin";
import { type App, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App | undefined;

if (!admin.apps.length) {
    console.info("[FIREBASE_ADMIN]: Initializing Firebase Admin SDK...");
    app = initializeApp();

    getFirestore(app).settings({
        ignoreUndefinedProperties: true,
    });
} else {
    const [defaultApp] = admin.apps;

    app = defaultApp ?? initializeApp();

    if (!defaultApp) {
        getFirestore(app).settings({
            ignoreUndefinedProperties: true,
        });
    }
}

export default app;
