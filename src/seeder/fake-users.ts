import type { CounterData } from "$_model/counter";

import "dotenv/config";
import { cert } from "firebase-admin/app";
import { Timestamp } from "firebase-admin/firestore";
import { faker } from "@faker-js/faker";

import { initializeSeeder, runSeeder } from "./_fireseed";
import { counterConverter } from "$_collection/counter";
import { getFileContent } from "$utils/file-system";
import { getGravatarURL } from "$utils/generator";

const config = {
    credential: cert(
        JSON.parse(getFileContent(process.env.GOOGLE_APPLICATION_CREDENTIALS as string))
    ),
    storageBucket: process.env.STORAGE_BUCKET,
};

initializeSeeder(config);

const fakeUsers = runSeeder(async ({ auth, firestore }) => {
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

    const snapshot = await firestore
        .collection("counter")
        .withConverter(counterConverter)
        .doc("users")
        .get();

    const { count } = snapshot.data() as CounterData;

    await firestore
        .collection("counter")
        .doc("users")
        .set({
            count: count + COUNT,
        });

    console.info("Seeding fake users completed");
});

await Promise.allSettled([fakeUsers])
    .then(() => {
        console.info("Seeding completed");
    })
    .catch((err) => {
        console.error(err);
    });
