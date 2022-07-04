import type { User } from "$_model/user";

import { MailTriggerService } from "$routes/_services/mail";

interface EmailData {
    name: string;
    action_url: string;
}

export interface EmailService {
    send: () => Promise<void>;
}

export class SendVerificationEmail implements EmailService {
    private service: MailTriggerService;

    constructor(private user: User) {
        this.service = new MailTriggerService(user, "email-verification");
    }

    send = async () => {
        await this.service.sendEmail<EmailData>({
            name: this.user.data().displayName,
            action_url: await this.user.getEmailVerificationLink(),
        });
    };
}

export class SendPasswordResetLink implements EmailService {
    private service: MailTriggerService;

    constructor(private user: User) {
        this.service = new MailTriggerService(user, "password-reset");
    }

    send = async () => {
        await this.service.sendEmail<EmailData>({
            name: this.user.data().displayName,
            action_url: await this.user.getPasswordResetLink(),
        });
    };
}
