import type { UserEntity } from "$module/user/user.entity";
import { getGravatarURL } from "$client/utils/generator";
import { Timestamp } from "firebase-admin/firestore";
import { runSeeder } from "../_fireseed";

const users = [
    {
        displayName: "Test Admin User",
        email: "admin-user@test.io",
        password: "t3st-Password",
        emailVerified: true,
        photo: getGravatarURL("admin-user@test.io"),
        isAdmin: true,
    },
    {
        displayName: "Test Normal User",
        email: "normal-user@test.io",
        password: "t3st-Password",
        emailVerified: true,
        photo: getGravatarURL("normal-user@test.io"),
        isAdmin: false,
    },
    {
        displayName: "Test Unverified User",
        email: "unverified-user@test.io",
        password: "t3st-Password",
        emailVerified: false,
        photo: getGravatarURL("unverified-user@test.io"),
        isAdmin: false,
    },
];

export default runSeeder(async ({ auth, firestore }) => {
    users.map(async (user) => {
        console.info(`Seeding users: ${user.displayName}`);

        const userRecord = await auth.createUser({
            displayName: user.displayName,
            email: user.email,
            password: user.password,
            emailVerified: user.emailVerified,
            photoURL: getGravatarURL(user.email),
        });

        const customClaims = {
            isAdmin: user.isAdmin,
        };

        await auth.setCustomUserClaims(userRecord.uid, customClaims);

        if (user.emailVerified) {
            const userData: UserEntity = {
                displayName: userRecord.displayName as string,
                email: userRecord.email as string,
                emailVerified: userRecord.emailVerified,
                avatar: {
                    small: {
                        url: getGravatarURL(user.email, 200),
                        width: 200,
                        height: 200,
                        alt: `${userRecord.displayName} avatar`,
                    },
                    medium: {
                        url: getGravatarURL(user.email, 500),
                        width: 500,
                        height: 500,
                        alt: `${userRecord.displayName} avatar`,
                    },
                    large: {
                        url: getGravatarURL(user.email, 1200),
                        width: 1200,
                        height: 1200,
                        alt: `${userRecord.displayName} avatar`,
                    },
                },
                disabled: false,
                customClaims,
                createdAt: Timestamp.fromDate(new Date(userRecord.metadata.creationTime)),
            };

            await firestore.collection("users").doc(userRecord.uid).set(userData);
        }
    });

    const usersCount = users.filter((user) => user.emailVerified).length;

    await firestore.collection("counter").doc("users").set({
        count: usersCount,
    });
}).catch((err) => {
    console.error(err);
});
