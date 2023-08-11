import "dotenv/config";
import { applicationDefault } from "firebase-admin/app";

import { initializeSeeder, runSeeder } from "./_fireseed";

const config = {
    credential: applicationDefault(),
    storageBucket: process.env.STORAGE_BUCKET,
};

initializeSeeder(config);

await runSeeder(async ({ firestore }) => {
    firestore.settings({ ignoreUndefinedProperties: true });
});
