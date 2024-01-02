import type { EmailService } from "$module/common/contract/email";
import { EmailTriggerService } from "$module/common/services/email.service";
import type { Shop } from "$module/shop/shop.model";
import type { User } from "$module/user/user.model";
import { ShopStatus } from "$features/shops/enum";

interface ShopStatusData {
    name: string;
    shop: {
        name: string;
        status: ShopStatus;
    };
    action_url: string;
    isApproved: boolean;
    isRejected: boolean;
    isPending: boolean;
}

interface ShopSubmissionData {
    name: string;
    shop: {
        name: string;
        status: ShopStatus;
    };
    action_url: string;
}

export class ShopStatusEmail implements EmailService {
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
            "shop-status"
        );
    }

    async send() {
        const url = new URL(`/my/status?search=${this.shop.data.name}`, this.service.baseUrl);

        await this.service.sendEmail<ShopStatusData>({
            name: this.shop.data.createdBy.name,
            shop: {
                name: this.shop.data.name,
                status: this.shop.data.status,
            },
            action_url: url.toString(),
            isApproved: this.shop.data.status === ShopStatus.APPROVED,
            isRejected: this.shop.data.status === ShopStatus.REJECTED,
            isPending: this.shop.data.status === ShopStatus.PENDING,
        });
    }
}

export class ShopSubmissionEmail implements EmailService {
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
            "shop-submission"
        );
    }

    async send() {
        const url = new URL(`/shops?search=${this.shop.data.name}`, this.service.baseUrl);

        await this.service.sendEmail<ShopSubmissionData>({
            name: this.shop.data.createdBy.name,
            shop: {
                name: this.shop.data.name,
                status: this.shop.data.status,
            },
            action_url: url.toString(),
        });
    }
}
