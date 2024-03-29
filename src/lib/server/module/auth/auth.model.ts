import { ORIGIN } from "$env/static/private";

import app from "$server/services/firebase-admin";
import type { HasData } from "$module/common/contract/data";
import type { EmailService } from "$module/common/contract/email";
import type { CanSendEmail, HasAdmin } from "$module/auth/auth.contract";
import { UserCollection } from "$module/user/user.collection";
import type { UserSession } from "$features/authentication/types";

import { type ActionCodeSettings, getAuth } from "firebase-admin/auth";

export class Auth implements HasData<UserSession>, HasAdmin, CanSendEmail {
    constructor(protected user: UserSession) {}

    private auth = getAuth(app);
    private baseUrl = ORIGIN;
    private signInUrl = this.baseUrl + "/sign-in";
    private resetPasswordUrl = this.baseUrl + "/reset-password";

    get data() {
        return this.user;
    }

    get isAdmin() {
        return this.user.customClaims.isAdmin;
    }

    private getActionCode(link: string) {
        const url = new URL(link);
        return url.searchParams.get("oobCode") as string;
    }

    async revokeToken() {
        await this.auth.revokeRefreshTokens(this.user.uid);
    }

    async getEmailVerificationLink() {
        const link = await this.auth.generateEmailVerificationLink(this.user.email);

        const actionCode = this.getActionCode(link);

        const urlParams = new URLSearchParams({
            uid: this.user.uid,
            actionCode,
        });

        return `${this.signInUrl}?${urlParams.toString()}`;
    }

    async getPasswordResetLink() {
        const actionCodeSettings: ActionCodeSettings = { url: this.signInUrl };

        const link = await this.auth.generatePasswordResetLink(
            this.user.email as string,
            actionCodeSettings
        );

        const actionCode = this.getActionCode(link);

        const urlParams = new URLSearchParams({
            actionCode,
        });

        return `${this.resetPasswordUrl}?${urlParams.toString()}`;
    }

    async getUser() {
        return await UserCollection.getUserByUid(this.user.uid);
    }

    async sendEmail(service: EmailService) {
        await service.send();
    }
}
