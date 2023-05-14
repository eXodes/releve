import { categories } from "$features/categories/store";
import { countries } from "$features/countries/store";
import { deliveryServices } from "$features/delivery-providers/store";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
    const { session } = await parent();

    if (session.authenticated) {
        await countries.load({ fetch });
        await categories.load({ fetch });
        await deliveryServices.load({ fetch });
    }
};
