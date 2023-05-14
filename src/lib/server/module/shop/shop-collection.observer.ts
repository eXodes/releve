import type { Observer, Publisher } from "$module/common/contract/observable";
import type { ShopCollection } from "$module/shop/shop.collection";
import { User } from "$module/user/user.model";

export class ShopCollectionObserver implements Observer {
    constructor(private shopCollection: ShopCollection) {}

    private async updateShopsCreatedByUser(user: User) {
        const snapshot = await this.shopCollection.ref
            .where("createdBy.uid", "==", user.data.uid)
            .get();

        if (snapshot.empty) return;

        snapshot.docs.map(async (doc) => {
            await doc.ref.update({
                createdBy: {
                    uid: user.data.uid,
                    name: user.data.displayName,
                },
            });
        });
    }

    async updateSubject(subject: Publisher) {
        if (subject instanceof User) {
            await this.updateShopsCreatedByUser(subject);
        }
    }
}
