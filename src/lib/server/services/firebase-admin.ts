import admin from "firebase-admin";
import { type App, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App | undefined;

if (!admin.apps.length) {
    console.info("[FIREBASE_ADMIN]: Initializing Firebase Admin SDK...");
    app = initializeApp();
} else {
    const [defaultApp] = admin.apps;

    console.info("[FIREBASE_ADMIN]: Firebase Admin SDK already initialized:", defaultApp);

    app = defaultApp ?? initializeApp();
}

if (app) {
    getFirestore(app).settings({
        ignoreUndefinedProperties: true,
    });
}

export default app;
