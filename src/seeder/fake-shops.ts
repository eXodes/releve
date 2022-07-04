import "dotenv/config";
import { cert } from "firebase-admin/app";
import { faker } from "@faker-js/faker";
import { Timestamp } from "firebase-admin/firestore";

import { initializeSeeder, runSeeder } from "./_fireseed";
import { ShopStatus } from "$features/shops/enum";
import { getFile, getFileContent } from "$utils/file-system";

const config = {
    credential: cert(
        JSON.parse(getFileContent(process.env.GOOGLE_APPLICATION_CREDENTIALS as string))
    ),
    storageBucket: process.env.STORAGE_BUCKET,
};

initializeSeeder(config);

const fakeShops = runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding fake shops...");

    const categoriesPath = "src/seeder/json/categories.json";
    const deliveryServicesPath = "src/seeder/json/delivery-services.json";

    const categories: string[] = JSON.parse(getFile(categoriesPath) as string);
    const deliveryServices: string[] = JSON.parse(getFile(deliveryServicesPath) as string);
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

    const COUNT = 50;

    const shops = Array(COUNT).fill({});

    const user = await auth.getUserByEmail("releve@exodes.net");

    for (let index = 0; index < shops.length; index++) {
        await firestore
            .collection("shops")
            .doc()
            .set({
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
                createdAt: Timestamp.fromDate(
                    new Date(faker.date.between("2019-01-02", "2019-12-31"))
                ),
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

    console.info("Seeding fake shops completed");
});

await Promise.allSettled([fakeShops])
    .then(() => {
        console.info("Seeding completed");
    })
    .catch((err) => {
        console.error(err);
    });
