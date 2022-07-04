import type { Payload } from "$routes/sign-up/index";

import { getAuth } from "firebase-admin/auth";

import app from "../../hooks/admin";
import { User } from "$_model/user";
import { getGravatarURL } from "$utils/generator";

export abstract class UserAction {
    private static auth = getAuth(app);

    static verifySession = async (cookie: string): Promise<User> => {
        const { uid } = await this.auth.verifySessionCookie(cookie, true);

        return this.whereUid(uid);
    };

    static verifyToken = async (idToken: string): Promise<User> => {
        const { uid } = await this.auth.verifyIdToken(idToken);

        return this.whereUid(uid);
    };

    static whereUid = async (uid: string): Promise<User> => {
        const userRecord = await this.auth.getUser(uid);

        return new User(userRecord);
    };

    static whereEmail = async (email: string): Promise<User> => {
        const userRecord = await this.auth.getUserByEmail(email);

        return new User(userRecord);
    };

    static create = async ({ displayName, email, password }: Payload): Promise<User> => {
        const userRecord = await this.auth.createUser({
            displayName,
            email,
            password,
            photoURL: getGravatarURL(email, 200),
        });

        await this.auth.setCustomUserClaims(userRecord.uid, {
            isAdmin: false,
        });

        return new User(userRecord);
    };
}
