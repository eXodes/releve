import type { User } from "$_model/user";

import { getPublicPath } from "$utils/firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

abstract class SendMail {
    protected name = process.env.SVELTE_APP_NAME as string;
    protected url = process.env.APP_URL as string;
    protected logo = getPublicPath("/assets/logo.svg");

    abstract sendEmail: <T>(data: T) => Promise<void>;
}

export class MailTriggerService extends SendMail {
    protected collection = getFirestore().collection("extensions/mail-trigger/processed");

    constructor(private user: User, private template: string) {
        super();
    }

    sendEmail = async <T>(data: T) => {
        await this.collection.add({
            to: `${this.user.data().displayName} <${this.user.data().email}>`,
            template: {
                name: this.template,
                data: {
                    product: {
                        name: this.name,
                        url: this.url,
                        logo: this.logo,
                    },
                    ...data,
                },
            },
        });
    };
}
