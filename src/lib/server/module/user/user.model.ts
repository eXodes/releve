import type { UserData } from "$features/users/types";
import type { HasData } from "$module/common/contract/data";
import type { Observer, Publisher } from "$module/common/contract/observable";
import type { UserEntity } from "$module/user/user.entity";

import { Timestamp } from "firebase-admin/firestore";

export class User implements HasData<UserData>, Publisher {
    protected userData: UserData;
    protected observers: Observer[] = [];

    constructor(uid: string, data: UserEntity) {
        this.userData = {
            uid: uid,
            displayName: data.displayName,
            about: data.about,
            email: data.email,
            emailVerified: data.emailVerified,
            avatar: data.avatar,
            disabled: data.disabled,
            customClaims: {
                isAdmin: data.customClaims.isAdmin,
            },
            createdAt:
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt),
        };
    }

    get data() {
        return this.userData;
    }

    attachObserver(observer: Observer): void {
        const isExist = this.observers.includes(observer);

        if (!isExist) {
            this.observers = [...this.observers, observer];
        }
    }

    detachObserver(observer: Observer): void {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notifyObserver(): void {
        for (const observer of this.observers) {
            observer.updateSubject(this);
        }
    }
}
