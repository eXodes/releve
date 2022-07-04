import type { firestore } from "firebase-admin";
import type { DeliveryServiceData } from "$_model/delivery-service";
import type { ListData } from "$types/collection";

import { Collection } from "$_model/database";

const deliveryServiceConverter = {
    toFirestore(category: DeliveryServiceData): firestore.DocumentData {
        return {
            name: category.name,
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): DeliveryServiceData {
        const data = snapshot.data();

        return {
            name: data.name,
        } as DeliveryServiceData;
    },
};

export class DeliveryServiceCollection extends Collection<DeliveryServiceData> {
    constructor() {
        super("delivery-services", deliveryServiceConverter);
    }

    getSortedDeliveryServices = async (): Promise<ListData[]> => {
        const snapshots = await this.collection.orderBy("name").get();

        if (snapshots.empty) {
            return [];
        }

        return snapshots.docs.map((snapshot) => ({
            label: snapshot.data().name,
            value: snapshot.id,
        }));
    };
}
