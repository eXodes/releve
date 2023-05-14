import { categoryConverter } from "$module/category/category.converter";
import type { CategoryEntity } from "$module/category/category.entity";
import type { Category } from "$module/category/category.model";
import { Collection } from "$module/common/services/collection.service";

export const CATEGORY_COLLECTION_NAME = "categories";

export class CategoryCollection extends Collection<CategoryEntity, Category> {
    constructor() {
        super(CATEGORY_COLLECTION_NAME, categoryConverter);
    }

    static async create(category: CategoryEntity) {
        const categoryCollection = new CategoryCollection();
        const uid = categoryCollection.ref.doc().id;

        await categoryCollection.set({
            uid,
            ...category,
        });

        const snapshot = await categoryCollection.withConverter.doc(uid).get();

        return snapshot.data() as Category;
    }

    static async delete(uid: string): Promise<void> {
        const categoryCollection = new CategoryCollection();

        await categoryCollection.delete(uid);
    }

    static async deleteAll(uids: string[]) {
        const categoryCollection = new CategoryCollection();

        uids.map(async (uid) => await categoryCollection.delete(uid));
    }

    static async getCategories({ orderBy = "name" } = { orderBy: "name" }) {
        const categoryCollection = new CategoryCollection();

        const snapshot = await categoryCollection.withConverter.orderBy(orderBy).get();

        return snapshot.docs.map((doc) => doc.data());
    }
}
