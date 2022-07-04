import type { firestore } from "firebase-admin";
import type { CategoryData } from "$_model/category";
import type { ListData } from "$types/collection";

import { Collection } from "$_model/database";

const categoryConverter = {
    toFirestore(category: CategoryData): firestore.DocumentData {
        return {
            name: category.name,
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): CategoryData {
        const data = snapshot.data();

        return {
            name: data.name,
        } as CategoryData;
    },
};

export class CategoryCollection extends Collection<CategoryData> {
    constructor() {
        super("categories", categoryConverter);
    }

    getSortedCategories = async (): Promise<ListData[]> => {
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
