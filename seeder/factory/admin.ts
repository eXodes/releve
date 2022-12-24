import { Timestamp } from "firebase-admin/firestore";

import { runSeeder } from "../_fireseed";
import { getGravatarURL } from "$utils/generator";

const production = process.env.NODE_ENV === "production";

export default runSeeder(async ({ auth, firestore }) => {
    try {
        await auth.getUserByEmail(process.env.MAIL_FROM_ADDRESS as string);
    } catch {
        console.info("Seeding admin...");

        const userRecord = await auth.createUser({
            displayName: process.env.MAIL_FROM_NAME,
            email: process.env.MAIL_FROM_ADDRESS,
            password: process.env.ADMIN_PASSWORD,
            emailVerified: true,
            photoURL: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string),
        });

        const customClaims = {
            isAdmin: true,
        };

        await auth.setCustomUserClaims(userRecord.uid, customClaims);

        await firestore
            .collection("users")
            .doc(userRecord.uid)
            .set({
                displayName: userRecord.displayName,
                about: null,
                email: userRecord.email,
                emailVerified: userRecord.emailVerified,
                avatar: {
                    small: {
                        url: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string, 200),
                    },
                    medium: {
                        url: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string, 500),
                    },
                    large: {
                        url: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string, 1200),
                    },
                },
                disabled: false,
                customClaims,
                createdAt: Timestamp.fromDate(
                    production ? new Date(userRecord.metadata.creationTime) : new Date("2019-01-01")
                ),
            });

        await firestore.collection("counter").doc("users").set({
            count: 1,
        });
    }
}).catch((err) => {
    console.error(err);
});
