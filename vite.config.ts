import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig, loadEnv } from "vite";

const config = defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            sentrySvelteKit({
                sourceMapsUploadOptions: {
                    telemetry: false,
                    deploy: {
                        env: env.PUBLIC_APP_ENV,
                    },
                    setCommits: {
                        auto: true,
                    },
                },
                autoUploadSourceMaps: env.SENTRY_RELEASE !== undefined,
            }),
            sveltekit(),
            SvelteKitPWA(),
        ],
    };
});

export default config;
