import { getGravatarURL } from "$client/utils/generator";
import type { UserEntity } from "$module/user/user.entity";
import { faker } from "@faker-js/faker";
import { Timestamp } from "firebase-admin/firestore";

import { runSeeder } from "../_fireseed";

runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding fake users...");

    const COUNT = 50;

    const users = Array(COUNT).fill({});

    for (let index = 0; index < users.length; index++) {
        const email = faker.internet.email();

        const user: UserEntity = {
            displayName: faker.person.fullName(),
            email: faker.internet.email(),
            emailVerified: true,
            avatar: {
                small: {
                    url: getGravatarURL(email, 200),
                    width: 200,
                    height: 200,
                },
                medium: {
                    url: getGravatarURL(email, 500),
                    width: 500,
                    height: 500,
                },
                large: {
                    url: getGravatarURL(email, 1200),
                    width: 1200,
                    height: 1200,
                },
            },
            customClaims: {
                isAdmin: faker.helpers.arrayElement([true, false]),
            },
            disabled: false,
            createdAt: Timestamp.fromDate(
                new Date(faker.date.between({ from: "2019-01-02", to: "2019-12-31" }))
            ),
        };

        const record = await auth.createUser({
            displayName: user.displayName,
            email: user.email,
            password: "fake-password",
            emailVerified: user.emailVerified,
            photoURL: user.avatar.small.url,
        });

        await auth.setCustomUserClaims(record.uid, user.customClaims);

        await firestore
            .collection("users")
            .doc(record.uid)
            .set({
                displayName: record.displayName,
                email: record.email,
                emailVerified: record.emailVerified,
                avatar: user.avatar,
                customClaims: user.customClaims,
                disabled: user.disabled,
                createdAt: Timestamp.fromDate(
                    new Date(faker.date.between({ from: "2019-01-02", to: "2019-12-31" }))
                ),
            });
    }

    const snapshot = await firestore.collection("users").get();

    await firestore.collection("counter").doc("users").set({
        count: snapshot.size,
    });
})
    .then(() => {
        console.info("Seeding fake users completed");
    })
    .catch((error) => {
        console.error(error);
    });
