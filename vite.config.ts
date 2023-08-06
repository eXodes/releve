import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
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
        ],
    };
});

export default config;
