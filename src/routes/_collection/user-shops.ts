import { ShopCollection } from "$_collection/shops";
import type { ShopData } from "$_model/shop";

export class UserShopCollection extends ShopCollection {
    constructor(uid: string) {
        super("users/" + uid + "/shops", "/my/shops");
    }

    add = async (shop: Omit<ShopData, "status">) => {
        await super.add(shop);

        await this.increaseCounter();
    };

    delete = async (uid: string) => {
        await super.delete(uid);

        await this.decreaseCounter();
    };
}
