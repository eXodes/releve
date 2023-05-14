import type { Bucket } from "@google-cloud/storage";
import "dotenv/config";
import admin from "firebase-admin";
import { type App, type AppOptions, initializeApp } from "firebase-admin/app";
import { type Auth, getAuth } from "firebase-admin/auth";
import { type Firestore, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

interface RunServices {
    app: App;
    auth: Auth;
    firestore: Firestore;
    bucket: Bucket;
}

class FirebaseSeeder {
    private app: App | undefined;
    private auth: Auth | undefined;
    private firestore: Firestore | undefined;
    private bucket: Bucket | undefined;

    constructor(protected config?: AppOptions) {
        if (config) this.init(config);
    }

    init(config: AppOptions) {
        if (admin.apps.length === 0) {
            this.app = initializeApp(config);
        }

        if (this.app) {
            this.auth = getAuth(this.app);

            this.firestore = getFirestore(this.app);

            this.bucket = getStorage(this.app).bucket(process.env.STORAGE_BUCKET);
        }
    }

    async seed(run: (services: RunServices) => void | Promise<void>) {
        if (!this.app) {
            throw new Error("App is not initialized");
        }

        if (!this.auth) {
            throw new Error("Auth is not initialized");
        }

        if (!this.firestore) {
            throw new Error("Firestore is not initialized");
        }

        if (!this.bucket) {
            throw new Error("Bucket is not initialized");
        }

        return run({
            app: this.app,
            auth: this.auth,
            firestore: this.firestore,
            bucket: this.bucket,
        });
    }
}

const firebaseSeeder = new FirebaseSeeder();

export const initializeSeeder = (config: AppOptions) => {
    console.info("Initializing firebase seeder...");
    firebaseSeeder.init(config);
};

export const runSeeder = async (run: (services: RunServices) => void | Promise<void>) => {
    await firebaseSeeder.seed(run);
};
