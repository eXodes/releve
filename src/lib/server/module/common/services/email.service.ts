import { PUBLIC_APP_NAME } from "$env/static/public";
import { ORIGIN } from "$env/static/private";

import app from "$server/services/firebase-admin";

import type { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

interface RecipientData {
    name: string;
    email: string;
}

type Template = "email-verification" | "password-reset" | "shop-status" | "shop-submission";

abstract class SendEmail {
    public baseUrl = ORIGIN;
    protected appName = PUBLIC_APP_NAME;
    protected appLogo = this.baseUrl + "/workflow-mark.png";

    abstract sendEmail<T>(data: T): Promise<void>;
}

export class EmailTriggerService extends SendEmail {
    protected PROCESSED_COLLECTION = "extensions/mail-trigger/processed";
    protected collection = getFirestore(app as App).collection(this.PROCESSED_COLLECTION);

    constructor(
        private recipient: RecipientData,
        private template: Template
    ) {
        super();
    }

    async sendEmail<T>(data: T) {
        await this.collection.add({
            to: `${this.recipient.name} <${this.recipient.email}>`,
            template: {
                name: this.template,
                data: {
                    app: {
                        url: this.baseUrl,
                        name: this.appName,
                        logo: this.appLogo,
                    },
                    ...data,
                },
            },
        });
    }
}
