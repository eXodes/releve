import type { EmailService, ShopData } from "$module/common/contract/email";
import { EmailTriggerService } from "$module/common/services/email.service";
import type { Shop } from "$module/shop/shop.model";
import type { User } from "$module/user/user.model";
import { ShopStatus } from "$features/shops/enum";

export class NewShopEmail implements EmailService {
    private service: EmailTriggerService;

    constructor(
        private shop: Shop,
        private user: User
    ) {
        this.service = new EmailTriggerService(
            {
                name: this.user.data.displayName,
                email: this.user.data.email,
            },
            "new-shop"
        );
    }

    async send() {
        await this.service.sendEmail<ShopData>({
            name: this.shop.data.createdBy.name,
            shop: {
                name: this.shop.data.name,
                status: this.shop.data.status,
            },
            isApproved: this.shop.data.status === ShopStatus.APPROVED,
            isRejected: this.shop.data.status === ShopStatus.REJECTED,
            isPending: this.shop.data.status === ShopStatus.PENDING,
        });
    }
}
