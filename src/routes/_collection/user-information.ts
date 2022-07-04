import type { firestore } from "firebase-admin";
import type { BaseEntity } from "$_model/database";
import type { UserData, UserInformation } from "$_model/user";
import type { Observer, Subject } from "$routes/_contracts/observable";

import { Collection } from "$_model/database";
import { userConverter } from "$_collection/users";

const userInformationConverter = {
    toFirestore(user: UserInformation): firestore.DocumentData {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: {
                street: user.address?.street,
                city: user.address?.city,
                state: user.address?.state,
                postalCode: user.address?.postalCode,
                country: user.address?.country,
            },
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): UserInformation {
        const data = snapshot.data();

        return {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            address: {
                street: data.address?.street,
                city: data.address?.city,
                state: data.address?.state,
                postalCode: data.address?.postalCode,
                country: data.address?.country,
            },
        } as UserInformation;
    },
};

export class UserInformationCollection extends Collection<UserData> implements Subject {
    private subCollection = "details";
    private informationDoc = "information";
    private observers: Observer[] = [];

    constructor(protected userCollection: Collection<UserData>) {
        super("users", userConverter);
    }

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

    private setUserInformation = async (uid: string, information: UserInformation) => {
        await this.collection
            .doc(uid)
            .collection(this.subCollection)
            .withConverter(userInformationConverter)
            .doc(this.informationDoc)
            .set(information as UserInformation, { merge: true });
    };

    get = async (uid: string) => {
        const user = await this.userCollection.get(uid);

        const snapshot = await this.collection
            .doc(uid)
            .collection(this.subCollection)
            .withConverter(userInformationConverter)
            .doc(this.informationDoc)
            .get();

        const information = snapshot.exists ? snapshot.data() : undefined;

        return {
            ...user,
            information: {
                firstName: information?.firstName,
                lastName: information?.lastName,
                phoneNumber: information?.phoneNumber,
                address: {
                    street: information?.address?.street,
                    city: information?.address?.city,
                    state: information?.address?.state,
                    postalCode: information?.address?.postalCode,
                    country: information?.address?.country,
                },
            },
        };
    };

    set = async ({ information, ...user }: Partial<BaseEntity & UserData>) => {
        await super.set(user);

        if (information) await this.setUserInformation(user.uid as string, information);

        this.notify();
    };
}
