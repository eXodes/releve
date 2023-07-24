import { ORIGIN } from "$env/static/private";
import { SVELTE_APP_NAME } from "$env/static/public";
import type { Auth } from "$module/auth/auth.model";
import app from "$server/services/firebase-admin";

import type { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

abstract class SendEmail {
    protected name = SVELTE_APP_NAME;
    protected url = ORIGIN;
    protected logo = ORIGIN + "/workflow-mark.svg";

    abstract sendEmail<T>(data: T): Promise<void>;
}

export class EmailTriggerService extends SendEmail {
    protected PROCESSED_COLLECTION = "extensions/mail-trigger/processed";
    protected collection = getFirestore(app as App).collection(this.PROCESSED_COLLECTION);

    constructor(private user: Auth, private template: string) {
        super();
    }

    async sendEmail<T>(data: T) {
        await this.collection.add({
            to: `${this.user.data.displayName} <${this.user.data.email}>`,
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
    }
}
