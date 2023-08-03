import { logger } from "firebase-functions/v2";
import { onRequest, type Request } from "firebase-functions/v2/https";
import type { Response } from "express";

let sveltekitServer: (request: Request, response: Response) => Promise<void>;

export const sveltekitSSR = onRequest(
    { region: "asia-southeast1", minInstances: 0, maxInstances: 10 },
    async (request, response) => {
        if (!sveltekitServer) {
            logger.info("Initialising SvelteKit SSR...");

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - no type information available for module
            sveltekitServer = await import("../lib/sveltekitSSR").then((module) => module.default);

            logger.info("SvelteKit SSR entry initialised!");
        }

        try {
            logger.info("Requested resource: " + request.originalUrl);

            return sveltekitServer(request, response);
        } catch (error) {
            logger.error(error);
            response.status(500).send({
                error: "Internal server error",
            });
        }
    }
);
