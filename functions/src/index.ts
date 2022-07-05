import { RuntimeOptions } from "firebase-functions";
import * as functions from "firebase-functions";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - no type information available for module
import sveltekitServer from "../lib/sveltekit";

const runtimeOptions: RuntimeOptions = {
    minInstances: 1,
};

export const sveltekit = functions
    .runWith(runtimeOptions)
    .https.onRequest(async (request, response) => {
        if (!sveltekitServer) {
            functions.logger.info("Initialising SvelteKit SSR entry");
            functions.logger.info("SvelteKit SSR entry initialised!");
        }

        functions.logger.info("Requested resource: " + request.originalUrl);

        let result;

        try {
            result = sveltekitServer(request, response);
        } catch (error) {
            functions.logger.error(error);
        }

        return result;
    });
