import type { ShopEntity } from "$module/shop/shop.entity";
import { faker } from "@faker-js/faker";
import { Timestamp } from "firebase-admin/firestore";

import { runSeeder } from "../_fireseed";

runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding fake user shops...");

    const categories: string[] = await firestore
        .collection("categories")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data().name));

    const deliveryProviders: string[] = await firestore
        .collection("delivery-providers")
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data().name));

    const COUNT = 50;

    const shops = Array(COUNT).fill({});

    const user = await auth.getUserByEmail(process.env.MAIL_FROM_ADDRESS as string);

    for (let index = 0; index < shops.length; index++) {
        const shop: Omit<ShopEntity, "status"> = {
            name: faker.company.name(),
            link: faker.internet.domainWord() + ".com",
            categories: faker.helpers.arrayElements(
                categories,
                faker.datatype.number({ min: 1, max: 3 })
            ),
            deliveryProviders: faker.helpers.arrayElements(
                deliveryProviders,
                faker.datatype.number({ min: 1, max: 3 })
            ),
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
                name: user.displayName as string,
            },
        };

        await firestore.collection(`${"users"}/${user.uid}/shops`).add(shop);
    }

    const snapshot = await firestore.collection(`${"users"}/${user.uid}/shops`).get();

    await firestore.collection("counter").doc(`${"users"}/${user.uid}/shops`).set({
        count: snapshot.size,
    });
})
    .then(() => {
        console.info("Seeding fake user shops completed");
    })
    .catch((error) => {
        console.error(error);
    });
