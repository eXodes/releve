import type { CategoryData } from "$features/categories/types";
import type { CategoryEntity } from "$module/category/category.entity";
import type { HasData } from "$module/common/contract/data";

export class Category implements HasData<CategoryData> {
    protected categoryData: CategoryData;

    constructor(uid: string, data: CategoryEntity) {
        this.categoryData = {
            uid: uid,
            ...data,
        };
    }

    get data() {
        return this.categoryData;
    }
}
