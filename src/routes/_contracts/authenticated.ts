import type { EmailService } from "$routes/_actions/email";

export interface HasAdmin {
    isAdmin: () => boolean;
}

export interface CanSendEmail {
    sendEmail: (service: EmailService) => Promise<void>;
}
