import { resolve } from "path";

import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-auto";

const dev = process.env.NODE_ENV === "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        csrf: {
            checkOrigin: !dev,
        },
        alias: {
            $lib: resolve("src/lib"),
            $client: resolve("src/lib/client"),
            $features: resolve("src/lib/client/features"),
            $server: resolve("src/lib/server"),
            $module: resolve("src/lib/server/module"),
            $routes: resolve("src/routes"),
            $tests: resolve("tests"),
        },
        env: {
            publicPrefix: "PUBLIC_",
        },
    },
};

export default config;
