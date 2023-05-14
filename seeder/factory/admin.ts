import type { UserEntity } from "$module/user/user.entity";
import { getGravatarURL } from "$client/utils/generator";
import { Timestamp } from "firebase-admin/firestore";
import { runSeeder } from "../_fireseed";

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

        const adminUser: UserEntity = {
            displayName: userRecord.displayName as string,
            email: userRecord.email as string,
            emailVerified: userRecord.emailVerified,
            avatar: {
                small: {
                    url: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string, 200),
                    width: 200,
                    height: 200,
                    alt: `${userRecord.displayName} avatar`,
                },
                medium: {
                    url: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string, 500),
                    width: 500,
                    height: 500,
                    alt: `${userRecord.displayName} avatar`,
                },
                large: {
                    url: getGravatarURL(process.env.MAIL_FROM_ADDRESS as string, 1200),
                    width: 1200,
                    height: 1200,
                    alt: `${userRecord.displayName} avatar`,
                },
            },
            disabled: false,
            customClaims: {
                isAdmin: customClaims.isAdmin,
            },
            createdAt: Timestamp.fromDate(
                production ? new Date(userRecord.metadata.creationTime) : new Date("2019-01-01")
            ),
        };

        await firestore.collection("users").doc(userRecord.uid).set(adminUser);

        await firestore.collection("counter").doc("users").set({
            count: 1,
        });
    }
}).catch((err) => {
    console.error(err);
});
