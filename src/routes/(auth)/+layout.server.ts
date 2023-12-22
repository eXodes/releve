import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals, depends }) => {
    if (locals.session) {
        redirect(303, "/");
    }

    depends("session");
};
