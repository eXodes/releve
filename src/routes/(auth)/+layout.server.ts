import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals, url, depends }) => {
    const redirectUrl = url.searchParams.get("redirect");

    if (locals.session) {
        redirect(303, redirectUrl ?? "/");
    }

    depends("session");
};
