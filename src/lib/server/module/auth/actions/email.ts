import type { Auth } from "$module/auth/auth.model";
import type { EmailData, EmailService } from "$module/common/contract/email";
import { EmailTriggerService } from "$module/common/services/email.service";

export class VerificationEmail implements EmailService {
    private service: EmailTriggerService;

    constructor(private user: Auth) {
        this.service = new EmailTriggerService(user, "email-verification");
    }

    async send() {
        await this.service.sendEmail<EmailData>({
            name: this.user.data.displayName,
            action_url: await this.user.getEmailVerificationLink(),
        });
    }
}

export class PasswordResetLinkEmail implements EmailService {
    private service: EmailTriggerService;

    constructor(private user: Auth) {
        this.service = new EmailTriggerService(user, "password-reset");
    }

    async send() {
        await this.service.sendEmail<EmailData>({
            name: this.user.data.displayName,
            action_url: await this.user.getPasswordResetLink(),
        });
    }
}
