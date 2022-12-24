import { Timestamp } from "firebase-admin/firestore";
import { faker } from "@faker-js/faker";

import { runSeeder } from "../_fireseed";
import { ShopStatus } from "$features/shops/enum";

runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding fake shops...");

    const categories: string[] = await firestore
        .collection("categories")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data().name));

    const deliveryServices: string[] = await firestore
        .collection("delivery-services")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data().name));

    const statuses: string[] = Object.values(ShopStatus);

    const getRandomCategory = (): string => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    };

    const getRandomDeliveryService = (): string => {
        const randomIndex = Math.floor(Math.random() * deliveryServices.length);
        return deliveryServices[randomIndex];
    };

    const getRandomStatus = (): string => {
        const randomIndex = Math.floor(Math.random() * statuses.length);
        return statuses[randomIndex];
    };

    const COUNT = 100;

    const shops = Array(COUNT).fill({});

    const user = await auth.getUserByEmail(process.env.MAIL_FROM_ADDRESS as string);

    for (let index = 0; index < shops.length; index++) {
        await firestore.collection("shops").add({
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
            status: getRandomStatus(),
            private: false,
            createdAt: Timestamp.fromDate(new Date(faker.date.between("2019-01-02", "2019-12-31"))),
            createdBy: {
                uid: user.uid,
                name: user.displayName,
            },
        });
    }

    const snapshot = await firestore
        .collection("shops")
        .where("status", "==", ShopStatus.APPROVED)
        .get();

    await firestore.collection("counter").doc("shops").set({
        count: snapshot.size,
    });
})
    .then(() => {
        console.info("Seeding fake shops completed");
    })
    .catch((error) => {
        console.error(error);
    });
