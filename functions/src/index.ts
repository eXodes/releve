import { RuntimeOptions } from "firebase-functions";
import * as functions from "firebase-functions";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - no type information available for module
import sveltekitServer from "../lib/sveltekit";

const runtimeOptions: RuntimeOptions = {
    minInstances: 0,
};

export const sveltekit = functions
    .runWith(runtimeOptions)
    .https.onRequest(async (request, response) => {
        functions.logger.info("Requested resource: " + request.originalUrl);

        try {
            return await sveltekitServer(request, response);
        } catch (error) {
            functions.logger.error(error);
            response.status(500).send({
                error: "Internal server error",
            });
        }
    });
