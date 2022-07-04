import type { auth } from "firebase-admin";
import { type CookieSerializeOptions, serialize } from "cookie";
import type { EmailService } from "$routes/_actions/email";
import type { CanSendEmail, HasAdmin } from "$routes/_contracts/authenticated";

import { getAuth } from "firebase-admin/auth";

import { UserAction } from "$routes/_actions/authenticated";
import { getDayInSecond } from "$utils/cookie";

export abstract class AuthenticatedUser extends UserAction implements HasAdmin, CanSendEmail {
    protected auth = getAuth();
    protected abstract user: auth.UserRecord;

    private appUrl = process.env.APP_URL;

    private getActionCode = (link: string) => {
        const url = new URL(link);
        return url.searchParams.get("oobCode") as string;
    };

    createCookie = async (idToken?: string, keep?: boolean) => {
        const expiresIn = idToken ? getDayInSecond(keep ? 7 : 1) : 0;

        const options: CookieSerializeOptions = { maxAge: expiresIn, httpOnly: true, secure: true };

        const sessionCookie = idToken
            ? await this.auth.createSessionCookie(idToken, {
                  expiresIn: expiresIn * 1000,
              })
            : "";

        return serialize("session", sessionCookie, options);
    };

    updatePassword = async (password: string) => {
        await this.auth.updateUser(this.user.uid, { password });
    };

    revokeToken = async () => {
        await this.auth.revokeRefreshTokens(this.user.uid);
    };

    getEmailVerificationLink = async () => {
        const link = await this.auth.generateEmailVerificationLink(this.user.email as string);

        const actionCode = this.getActionCode(link);

        return (
            this.appUrl +
            "/sign-in?" +
            new URLSearchParams({
                uid: this.user.uid,
                actionCode,
            })
        );
    };

    getPasswordResetLink = async () => {
        const actionCodeSettings = { url: process.env.APP_URL + "/sign-in" };

        const link = await this.auth.generatePasswordResetLink(
            this.user.email as string,
            actionCodeSettings
        );

        const actionCode = this.getActionCode(link);

        return (
            this.appUrl +
            "/reset-password?" +
            new URLSearchParams({
                actionCode,
            })
        );
    };

    isAdmin = () => {
        return this.user.customClaims?.admin;
    };

    sendEmail = async (service: EmailService) => {
        await service.send();
    };
}
