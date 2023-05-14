import { Collection } from "$module/common/services/collection.service";
import { deliveryProviderConverter } from "$module/delivery-provider/delivery-provider.converter";
import type { DeliveryProviderEntity } from "$module/delivery-provider/delivery-provider.entity";
import type { DeliveryProvider } from "$module/delivery-provider/delivery-provider.model";

export const DELIVERY_PROVIDER_COLLECTION_NAME = "delivery-providers";

export class DeliveryProviderCollection extends Collection<
    DeliveryProviderEntity,
    DeliveryProvider
> {
    constructor() {
        super(DELIVERY_PROVIDER_COLLECTION_NAME, deliveryProviderConverter);
    }

    static async create(deliveryProvider: DeliveryProviderEntity) {
        const deliveryProviderCollection = new DeliveryProviderCollection();
        const uid = deliveryProviderCollection.ref.doc().id;

        await deliveryProviderCollection.add({
            uid,
            ...deliveryProvider,
        });

        const snapshot = await deliveryProviderCollection.withConverter.doc(uid).get();

        return snapshot.data() as DeliveryProvider;
    }

    static async delete(uid: string): Promise<void> {
        const deliveryProviderCollection = new DeliveryProviderCollection();

        await deliveryProviderCollection.delete(uid);
    }

    static async deleteAll(uids: string[]) {
        const deliveryProviderCollection = new DeliveryProviderCollection();

        uids.map(async (uid) => await deliveryProviderCollection.delete(uid));
    }

    static async getDeliveryProviders({ orderBy = "name" } = { orderBy: "name" }) {
        const deliveryProviderCollection = new DeliveryProviderCollection();

        const snapshot = await deliveryProviderCollection.withConverter.orderBy(orderBy).get();

        return snapshot.docs.map((doc) => doc.data());
    }
}
