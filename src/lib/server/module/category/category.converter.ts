import type { CategoryEntity } from "$module/category/category.entity";
import { Category } from "$module/category/category.model";
import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";

export const categoryConverter: FirestoreConverter<Category> = {
    toFirestore(category) {
        return category;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<CategoryEntity>) {
        const data = snapshot.data();

        return new Category(snapshot.id, data);
    },
};
