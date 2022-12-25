import "dotenv/config";
import { cert } from "firebase-admin/app";

import { initializeSeeder } from "./_fireseed";
import { getFile } from "$utils/file-system";

const production = process.env.NODE_ENV === "production";

const credentialFile = !production && getFile(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const credential = credentialFile ? cert(JSON.parse(credentialFile)) : undefined;

const config = {
    credential,
    storageBucket: process.env.STORAGE_BUCKET,
};

initializeSeeder(config);
