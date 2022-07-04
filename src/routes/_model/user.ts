import { UserCollection } from "$_collection/users";
import type { auth } from "firebase-admin";
import type { Timestamp } from "firebase-admin/firestore";
import type { Media, MediaImage } from "$_model/storage";
import type { HasUserData } from "$routes/_contracts/user";
import type { Observer, Subject } from "$routes/_contracts/observable";

import { AuthenticatedUser } from "$_model/authenticated";
import { MediaStorage } from "$_model/storage";
import { UserInformationCollection } from "$_collection/user-information";
import { getMd5Hash } from "$utils/generator";

export interface UserData {
    displayName: string;
    about?: string;
    email: string;
    emailVerified: boolean;
    avatar?: Media;
    disabled: boolean;
    customClaims?: {
        isAdmin: boolean;
    };
    createdAt: Timestamp;
    information?: UserInformation;
}

export interface UserInformation {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
}

export class UserAvatar extends MediaStorage {
    private path = "avatar/";
    private isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
    constructor(private uid: string) {
        super();
    }

    getSmallGravatar = (str: string): MediaImage<200> => {
        const url = new URL(`https://www.gravatar.com/avatar/${getMd5Hash(str)}`);
        url.searchParams.set("s", "200");
        url.searchParams.set("d", "retro");

        return {
            url: url.href,
            width: 200,
            height: 200,
        };
    };

    getMediumGravatar = (str: string): MediaImage<500> => {
        const url = new URL(`https://www.gravatar.com/avatar/${getMd5Hash(str)}`);
        url.searchParams.set("s", "500");
        url.searchParams.set("d", "retro");

        return {
            url: url.href,
            width: 500,
            height: 500,
        };
    };

    getLargeGravatar = (str: string): MediaImage<1200> => {
        const url = new URL(`https://www.gravatar.com/avatar/${getMd5Hash(str)}`);
        url.searchParams.set("s", "1200");
        url.searchParams.set("d", "retro");

        return {
            url: url.href,
            width: 1200,
            height: 1200,
        };
    };

    getGravatarUrl = (email: string): Media => {
        return {
            small: this.getSmallGravatar(email),
            medium: this.getMediumGravatar(email),
            large: this.getLargeGravatar(email),
        };
    };

    addAvatar = async (file: File): Promise<void> => {
        return super.addFile(this.path + this.uid, file, {
            public: this.isEmulator,
        });
    };

    getAvatarUrl = async (): Promise<Media> => {
        return this.isEmulator
            ? super.getPublicPath(this.path + this.uid)
            : super.getPublicUrl(this.path + this.uid);
    };
}

export class User extends AuthenticatedUser implements HasUserData, Observer, Subject {
    private observers: Observer[] = [];

    constructor(protected user: auth.UserRecord) {
        super();
    }

    private updateUserInformation = async (collection: UserInformationCollection) => {
        const user = await collection.get(this.user.uid);

        this.user = await this.auth.updateUser(this.user.uid, {
            displayName: user.displayName,
            photoURL: user.avatar?.small.url,
            phoneNumber: user.information.phoneNumber,
        });

        this.setCustomClaims({
            isAdmin: user.customClaims?.isAdmin ?? false,
        });

        this.notify();
    };

    private setCustomClaims = async (customClaims: Record<string, boolean>) => {
        await this.auth.setCustomUserClaims(this.user.uid, customClaims);
    };

    private deleteUser = async (): Promise<void> => {
        await this.auth.deleteUser(this.user.uid);
    };

    attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);

        if (!isExist) {
            this.observers = [...this.observers, observer];
        }
    }

    detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);

        if (observerIndex) {
            this.observers.splice(observerIndex, 1);
        }
    }

    notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    update = async (subject: Subject) => {
        if (subject instanceof UserInformationCollection) {
            await this.updateUserInformation(subject);
        }

        if (subject instanceof UserCollection) {
            await this.deleteUser();
        }
    };

    data = () => {
        return {
            uid: this.user.uid as string,
            displayName: this.user.displayName as string,
            email: this.user.email as string,
            emailVerified: this.user.emailVerified,
            photoURL: this.user.photoURL,
            phoneNumber: this.user.phoneNumber,
            disabled: this.user.disabled,
            customClaims: {
                isAdmin: this.user.customClaims?.isAdmin ?? false,
            },
            createdAt: this.user.metadata.creationTime,
        };
    };
}
