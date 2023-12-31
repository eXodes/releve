import type { ShopStatus } from "$features/shops/enum";

export interface AuthData {
    name: string;
    action_url: string;
}

export interface ShopData {
    name: string;
    shop: {
        name: string;
        status: ShopStatus;
    };
    isApproved: boolean;
    isRejected: boolean;
    isPending: boolean;
}

export interface EmailService {
    send: () => Promise<void>;
}
