import "dotenv/config";
import { applicationDefault } from "firebase-admin/app";

import { initializeSeeder } from "./_fireseed";

const config = {
    credential: applicationDefault(),
    storageBucket: process.env.STORAGE_BUCKET,
};

initializeSeeder(config);
