import { Timestamp } from "firebase-admin/firestore";
import { faker } from "@faker-js/faker";

import { runSeeder } from "../_fireseed";

runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding fake user shops...");

    const categories: string[] = await firestore
        .collection("categories")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data().name));

    const deliveryServices: string[] = await firestore
        .collection("delivery-services")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data().name));

    const getRandomCategory = (): string => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    };

    const getRandomDeliveryService = (): string => {
        const randomIndex = Math.floor(Math.random() * deliveryServices.length);
        return deliveryServices[randomIndex];
    };

    const COUNT = 100;

    const shops = Array(COUNT).fill({});

    const user = await auth.getUserByEmail(process.env.MAIL_FROM_ADDRESS as string);

    for (let index = 0; index < shops.length; index++) {
        await firestore.collection(`users/${user.uid}/shops`).add({
            name: faker.company.companyName(),
            link: faker.internet.domainWord() + ".com",
            categories: [getRandomCategory()],
            deliveryServices: [getRandomDeliveryService()],
            address: {
                street: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                postalCode: faker.address.zipCode(),
                country: faker.address.country(),
            },
            private: true,
            createdAt: Timestamp.fromDate(new Date(faker.date.between("2019-01-02", "2019-12-31"))),
            createdBy: {
                uid: user.uid,
                name: user.displayName,
            },
        });
    }

    const snapshot = await firestore.collection(`users/${user.uid}/shops`).get();

    await firestore.collection("counter").doc(`users/${user.uid}/shops`).set({
        count: snapshot.size,
    });
})
    .then(() => {
        console.info("Seeding fake user shops completed");
    })
    .catch((error) => {
        console.error(error);
    });
