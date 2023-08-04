import { resolve } from "path";

import { vitePreprocess } from "@sveltejs/kit/vite";
import firebase from "svelte-adapter-firebase";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: firebase(),
        alias: {
            $lib: resolve("src/lib"),
            $client: resolve("src/lib/client"),
            $features: resolve("src/lib/client/features"),
            $server: resolve("src/lib/server"),
            $module: resolve("src/lib/server/module"),
            $routes: resolve("src/routes"),
        },
        env: {
            publicPrefix: "PUBLIC_",
        },
    },
};

export default config;
