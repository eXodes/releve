import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";
import type { DeliveryProviderEntity } from "$module/delivery-provider/delivery-provider.entity";
import { DeliveryProvider } from "$module/delivery-provider/delivery-provider.model";

export const deliveryProviderConverter: FirestoreConverter<DeliveryProvider> = {
    toFirestore(deliveryProvider) {
        return deliveryProvider;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<DeliveryProviderEntity>) {
        const data = snapshot.data();

        return new DeliveryProvider(snapshot.id, data);
    },
};
