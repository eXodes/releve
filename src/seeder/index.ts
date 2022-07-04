import "dotenv/config";
import type { CountryData } from "$types/countries";
import { cert } from "firebase-admin/app";
import { Timestamp } from "firebase-admin/firestore";
import { initializeSeeder, runSeeder } from "./_fireseed";
import { getFile, getFileContent, getFiles } from "$utils/file-system";
import { getGravatarURL } from "$utils/generator";

const production = process.env.NODE_ENV === "production";

const credentialFile = !production && getFile(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const credential = credentialFile ? cert(JSON.parse(credentialFile)) : undefined;

const config = {
    credential,
    storageBucket: process.env.STORAGE_BUCKET,
};

interface Template {
    subject: string;
    html: string;
    text: string;
    attachments?: unknown[];
}

interface Partial {
    partial: boolean;
    html: string;
    text?: string;
}

initializeSeeder(config);

const users = runSeeder(async ({ auth, firestore }) => {
    console.info("Seeding admin...");

    const userRecord = await auth.createUser({
        displayName: process.env.MAIL_FROM_NAME,
        email: process.env.MAIL_FROM_ADDRESS,
        password: "Pa$$w0rd!",
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

    console.info("Seeding admin completed");
});

const assets = runSeeder(async ({ bucket }) => {
    console.info("Seeding assets...");

    const path = "src/seeder/assets";

    const assets = await getFiles(path);

    const promises = assets.map(async (file: string) => {
        const filePath = `${path}/${file}`;

        return await bucket.upload(filePath, {
            destination: `assets/${file}`,
            public: true,
        });
    });

    await Promise.allSettled(promises);

    console.info("Seeding assets completed");
});

const countries = runSeeder(async ({ firestore }) => {
    console.info("Seeding countries...");

    const path = "src/seeder/json/countries.json";

    const countries: CountryData[] = JSON.parse(getFile(path) as string);

    const collection = firestore.collection("countries");

    const snapshots = await collection.get();

    if (snapshots.empty) {
        for (const country of countries) {
            const countryRef = collection.doc();

            const batch = firestore.batch();

            batch.set(countryRef, {
                name: country.name,
                iso2: country.iso2,
                iso3: country.iso3,
                numericCode: country.numeric_code,
                phoneCode: country.phone_code,
                capital: country.capital,
                currency: country.currency,
                currencyName: country.currency_name,
                currencySymbol: country.currency_symbol,
                native: country.native,
                region: country.region,
                subregion: country.subregion,
                timezones: country.timezones,
                emoji: country.emoji,
            });

            const stateCollection = countryRef.collection("states");

            for (const state of country.states) {
                const stateRef = stateCollection.doc();

                batch.set(stateRef, {
                    id: state.id,
                    name: state.name,
                    state_code: state.state_code,
                    latitude: state.latitude,
                    longitude: state.longitude,
                });
            }

            await batch.commit();
        }
    }

    console.info("Seeding countries completed");
});

const categories = runSeeder(async ({ firestore }) => {
    console.info("Seeding categories...");

    const path = "src/seeder/json/categories.json";

    const categories: string[] = JSON.parse(getFile(path) as string);

    const collection = firestore.collection("categories");

    const snapshots = await collection.get();

    if (snapshots.empty) {
        for (const category of categories) {
            const categoryRef = collection.doc();

            const batch = firestore.batch();

            batch.set(categoryRef, {
                name: category,
            });

            await batch.commit();
        }
    }

    console.info("Seeding categories completed");
});

const deliveryServices = runSeeder(async ({ firestore }) => {
    console.info("Seeding delivery services...");

    const path = "src/seeder/json/delivery-services.json";

    const deliveryServices: string[] = JSON.parse(getFile(path) as string);

    const collection = firestore.collection("delivery-services");

    const snapshots = await collection.get();

    if (snapshots.empty) {
        for (const deliveryService of deliveryServices) {
            const deliveryServiceRef = collection.doc();

            const batch = firestore.batch();

            batch.set(deliveryServiceRef, {
                name: deliveryService,
            });

            await batch.commit();
        }
    }

    console.info("Seeding delivery services completed");
});

const templates = runSeeder(async ({ firestore }) => {
    console.info("Seeding templates...");

    const layout: Partial = {
        partial: true,
        html: getFileContent("src/seeder/templates/_layout.hbs"),
    };

    const emailVerification: Template = {
        subject: "Thank you for signing up for the Releve!",
        html: getFileContent("src/seeder/templates/email-verification.hbs"),
        text: "Hi {{name}}, thank you for registering with us. Please visit the link to verify your email address: {{action_url}}. Thank you.",
    };

    const resetPassword: Template = {
        subject: "Reset your password",
        html: getFileContent("src/seeder/templates/password-reset.hbs"),
        text: "Hi {{name}}, you have requested to reset your password. Please visit the link to reset your password.: {{action_url}}. Thank you.",
    };

    const collection = firestore.collection("extensions/mail-trigger/templates");

    const layoutRef = collection.doc("layout");
    await layoutRef.set(layout);

    const emailVerificationRef = collection.doc("email-verification");
    await emailVerificationRef.set(emailVerification);

    const resetPasswordRef = collection.doc("password-reset");
    await resetPasswordRef.set(resetPassword);

    console.info("Seeding templates completed");
});

await Promise.allSettled([users, assets, countries, categories, deliveryServices, templates])
    .then(() => {
        console.info("Seeding completed");
    })
    .catch((err) => {
        console.error(err);
    });
