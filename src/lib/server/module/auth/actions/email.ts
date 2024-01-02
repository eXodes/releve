import type { EmailService } from "$module/common/contract/email";
import { EmailTriggerService } from "$module/common/services/email.service";
import type { Auth } from "$module/auth/auth.model";

interface AuthData {
    name: string;
    action_url: string;
}

export class VerificationEmail implements EmailService {
    private service: EmailTriggerService;

    constructor(private auth: Auth) {
        this.service = new EmailTriggerService(
            {
                name: this.auth.data.displayName,
                email: this.auth.data.email,
            },
            "email-verification"
        );
    }

    async send() {
        await this.service.sendEmail<AuthData>({
            name: this.auth.data.displayName,
            action_url: await this.auth.getEmailVerificationLink(),
        });
    }
}

export class PasswordResetLinkEmail implements EmailService {
    private service: EmailTriggerService;

    constructor(private auth: Auth) {
        this.service = new EmailTriggerService(
            {
                name: this.auth.data.displayName,
                email: this.auth.data.email,
            },
            "password-reset"
        );
    }

    async send() {
        await this.service.sendEmail<AuthData>({
            name: this.auth.data.displayName,
            action_url: await this.auth.getPasswordResetLink(),
        });
    }
}
