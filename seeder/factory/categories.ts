import { getFile } from "$server/utils/file-system";
import { resolve } from "path";
import { runSeeder } from "../_fireseed";

export default runSeeder(async ({ firestore }) => {
    const path = resolve("./seeder/json/categories.json");

    const categories: string[] = JSON.parse(getFile(path) as string);

    const collection = firestore.collection("categories");

    const snapshots = await collection.get();

    const existing = snapshots.docs.map((doc) => doc.data().name) as string[];

    const batch = firestore.batch();

    for (const category of categories) {
        if (!existing.includes(category)) {
            console.info("Seeding categories: " + category);

            const categoryRef = collection.doc();

            batch.set(categoryRef, {
                name: category,
            });
        }
    }

    await batch.commit();
}).catch((err) => {
    console.error(err);
});
