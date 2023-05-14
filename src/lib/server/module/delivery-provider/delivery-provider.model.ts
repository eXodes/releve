import type { DeliveryProviderData } from "$features/delivery-providers/types";
import type { HasData } from "$module/common/contract/data";
import type { DeliveryProviderEntity } from "$module/delivery-provider/delivery-provider.entity";

export class DeliveryProvider implements HasData<DeliveryProviderData> {
    protected deliveryProviderData: DeliveryProviderData;

    constructor(uid: string, data: DeliveryProviderEntity) {
        this.deliveryProviderData = {
            uid: uid,
            ...data,
        };
    }

    get data() {
        return this.deliveryProviderData;
    }
}
