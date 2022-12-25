import { runSeeder } from "../_fireseed";
import { getFile } from "$utils/file-system";
import { resolve } from "path";

export default runSeeder(async ({ firestore }) => {
    const path = resolve("./seeder/json/delivery-services.json");

    const deliveryServices: string[] = JSON.parse(getFile(path) as string);

    const collection = firestore.collection("delivery-services");

    const snapshots = await collection.get();

    const existing = snapshots.docs.map((doc) => doc.data().name) as string[];

    const batch = firestore.batch();

    for (const deliveryService of deliveryServices) {
        if (!existing.includes(deliveryService)) {
            console.info("Seeding delivery services: " + deliveryService);

            const deliveryServiceRef = collection.doc();

            batch.set(deliveryServiceRef, {
                name: deliveryService,
            });
        }
    }

    await batch.commit();
}).catch((err) => {
    console.error(err);
});
