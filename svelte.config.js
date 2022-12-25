import { resolve } from "path";
import firebase from "svelte-adapter-firebase";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess({
        postcss: true,
    }),
    kit: {
        adapter: firebase(),
        methodOverride: {
            allowed: ["PATCH", "DELETE"],
        },
        alias: {
            $lib: resolve("src/lib"),
            $actions: resolve("src/lib/actions"),
            $components: resolve("src/lib/components"),
            $config: resolve("src/lib/config"),
            $enums: resolve("src/lib/enums"),
            $features: resolve("src/lib/features"),
            $stores: resolve("src/lib/stores"),
            $layouts: resolve("src/lib/layouts"),
            $types: resolve("src/lib/types"),
            $utils: resolve("src/lib/utils"),
            $validations: resolve("src/lib/validations"),
            $routes: resolve("src/routes"),
            $_model: resolve("src/routes/_model"),
            $_collection: resolve("src/routes/_collection"),
        },
        vite: {
            server: {
                cors: {
                    allowedHeaders: ["Set-Cookie"],
                    origin: process.env.APP_URL,
                },
            },
            envPrefix: "SVELTE_",
        },
    },
};

export default config;
