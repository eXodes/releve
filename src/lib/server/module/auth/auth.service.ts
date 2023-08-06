import app from "$server/services/firebase-admin";
import { options, SESSION_COOKIE } from "$server/utils/cookie";
import type { HasObserver, Observer } from "$module/common/contract/observable";
import { Auth } from "$module/auth/auth.model";
import { AuthObserver } from "$module/auth/auth.observer";
import type { User } from "$module/user/user.model";

import type { UserSession } from "$features/authentication/types";
import type { SignUpPayload } from "$features/authentication/validations/sign-up";
import { getDayInSecond } from "$client/utils/duration";
import { getGravatarURL } from "$client/utils/generator";

import { serialize } from "cookie";
import type { auth } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import type { UpdateRequest } from "firebase-admin/auth";

export class AuthService implements HasObserver {
    private static auth = getAuth(app);

    private static getSession(record: auth.UserRecord): UserSession {
        return {
            uid: record.uid,
            email: record.email as string,
            emailVerified: record.emailVerified,
            displayName: record.displayName as string,
            photoURL: record.photoURL as string,
            customClaims: record.customClaims as UserSession["customClaims"],
            disabled: record.disabled,
            createdAt: new Date(record.metadata.creationTime),
        };
    }

    createObserver(): Observer {
        return new AuthObserver();
    }

    static async verifySession(cookie: string): Promise<Auth> {
        const { uid } = await this.auth.verifySessionCookie(cookie, true);

        return this.whereUid(uid);
    }

    static async verifyToken(idToken: string): Promise<Auth> {
        const { uid } = await this.auth.verifyIdToken(idToken);

        return this.whereUid(uid);
    }

    static async createCookie(idToken?: string, keep?: boolean): Promise<string> {
        const expiresIn = idToken ? getDayInSecond(keep ? 7 : 1) : 0;

        const sessionCookie = idToken
            ? await this.auth.createSessionCookie(idToken, {
                  expiresIn: expiresIn * 1000,
              })
            : "";

        return serialize(SESSION_COOKIE, sessionCookie, { ...options, maxAge: expiresIn });
    }

    static async whereUid(uid: string): Promise<Auth> {
        const userRecord = await this.auth.getUser(uid);

        return new Auth(this.getSession(userRecord));
    }

    static async whereEmail(email: string): Promise<Auth> {
        const userRecord = await this.auth.getUserByEmail(email);

        return new Auth(this.getSession(userRecord));
    }

    static async create({ displayName, email, password }: SignUpPayload): Promise<Auth> {
        const newRecord = await this.auth.createUser({
            displayName,
            email,
            password,
            photoURL: getGravatarURL(email, 200),
        });

        await this.auth.setCustomUserClaims(newRecord.uid, {
            isAdmin: false,
        } satisfies UserSession["customClaims"]);

        const userRecord = await this.auth.getUser(newRecord.uid);

        return new Auth(this.getSession(userRecord));
    }

    static async updateRecord(user: User): Promise<void> {
        const { uid, customClaims, createdAt: _createdAt, avatar, ...data } = user.data;

        await this.auth.updateUser(uid, {
            ...data,
            photoURL: avatar.small.url,
        } satisfies UpdateRequest);

        await this.setCustomClaims(uid, customClaims);
    }

    static async setCustomClaims(
        uid: UserSession["uid"],
        customClaims: UserSession["customClaims"]
    ): Promise<void> {
        await this.auth.setCustomUserClaims(uid, customClaims);
    }

    static async updatePassword(uid: UserSession["uid"], password: string): Promise<void> {
        await this.auth.updateUser(uid, { password });
    }

    static async delete(uid: UserSession["uid"]): Promise<void> {
        await this.auth.deleteUser(uid);
    }
}
