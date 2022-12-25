import { Timestamp } from "firebase-admin/firestore";
import { faker } from "@faker-js/faker";

import { runSeeder } from "../_fireseed";
import { getGravatarURL } from "$utils/generator";

runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding fake users...");

    const COUNT = 50;

    const users = Array(COUNT).fill({});

    for (let index = 0; index < users.length; index++) {
        const email = faker.internet.email();

        const record = await auth.createUser({
            displayName: faker.name.findName(),
            email: faker.internet.email(),
            password: "Pa$$w0rd!",
            emailVerified: true,
            photoURL: getGravatarURL(email),
        });

        await firestore
            .collection("users")
            .doc(record.uid)
            .set({
                displayName: record.displayName,
                about: null,
                email: record.email,
                emailVerified: record.emailVerified,
                avatar: {
                    small: {
                        url: getGravatarURL(email, 200),
                    },
                    medium: {
                        url: getGravatarURL(email, 500),
                    },
                    large: {
                        url: getGravatarURL(email, 1200),
                    },
                },
                disabled: false,
                createdAt: Timestamp.fromDate(
                    new Date(faker.date.between("2019-01-02", "2019-12-31"))
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
