import { categories } from "$features/categories/store";
import { countries } from "$features/countries/store";
import { deliveryServices } from "$features/delivery-providers/store";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
    const { session } = await parent();

    if (session.authenticated) {
        await Promise.all([
            countries.load({ fetch }),
            categories.load({ fetch }),
            deliveryServices.load({ fetch }),
        ]);
    }
};
