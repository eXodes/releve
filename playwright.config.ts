import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const config = defineConfig({
    fullyParallel: true,
    webServer: {
        command: "npm run build && npm run preview",
        port: 4173,
    },
    testDir: "tests",
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
});

export default config;
