import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import colors from "tailwindcss/colors";

const config = defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        build: {
            sourcemap: "hidden",
        },
        plugins: [
            sentrySvelteKit({
                sourceMapsUploadOptions: {
                    cleanArtifacts: true,
                    rewrite: false,
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
                srcDir: "./src",
                registerType: "autoUpdate",
                includeAssets: ["favicon.png", "workflow-mark.png", "workflow-mark.svg"],
                strategies: "generateSW",
                scope: "/",
                base: "/",
                manifest: {
                    name: "Releve",
                    short_name: "Releve",
                    start_url: "/",
                    scope: "/",
                    theme_color: colors.white,
                    background_color: colors.white,
                    display: "standalone",
                    icons: [
                        {
                            src: "/workflow-mark-192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "/workflow-mark-512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                        {
                            src: "/workflow-mark-512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "maskable",
                        },
                    ],
                },
                injectManifest: {
                    globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
                },
                workbox: {
                    globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
                },
            }),
        ],
    } satisfies UserConfig;
});

export default config;
