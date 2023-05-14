import type { EmailService } from "$module/common/contract/email";

export interface HasAdmin {
    isAdmin: boolean;
}

export interface CanSendEmail {
    sendEmail(service: EmailService): Promise<void>;
}
