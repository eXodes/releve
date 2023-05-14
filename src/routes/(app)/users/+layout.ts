import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
    const { session } = await parent();

    const isAdmin = session.user?.customClaims.isAdmin;

    if (!isAdmin) {
        throw redirect(303, "/");
    }
};
