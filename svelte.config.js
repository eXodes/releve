import { resolve } from "path";

import { vitePreprocess } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            $lib: resolve("src/lib"),
            $client: resolve("src/lib/client"),
            $features: resolve("src/lib/client/features"),
            $server: resolve("src/lib/server"),
            $module: resolve("src/lib/server/module"),
            $routes: resolve("src/routes"),
        },
        env: {
            publicPrefix: "SVELTE_",
        },
    },
};

export default config;
