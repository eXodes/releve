import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig, loadEnv } from "vite";
import colors from "tailwindcss/colors";

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
            SvelteKitPWA({
                registerType: "autoUpdate",
                includeAssets: ["favicon.png", "workflow-mark.png", "workflow-mark.svg"],
                manifest: {
                    name: "Releve",
                    short_name: "Releve",
                    theme_color: colors.rose["600"],
                    background_color: colors.white,
                    display: "standalone",
                    icons: [
                        {
                            src: "workflow-mark-192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "workflow-mark-512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                        {
                            src: "workflow-mark-512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "maskable",
                        },
                    ],
                },
                workbox: {
                    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                    globIgnores: ["server/*.*", "server/sw.js", "server/workbox-*.js"],
                },
            }),
        ],
    };
});

export default config;
