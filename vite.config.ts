import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";

const config = defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "SENTRY_");

    return {
        plugins: [
            sentrySvelteKit({
                sourceMapsUploadOptions: {
                    telemetry: false,
                },
                autoUploadSourceMaps: env.SENTRY_RELEASE !== undefined,
            }),
            sveltekit(),
        ],
    };
});

export default config;
