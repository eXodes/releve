import { getFileContent } from "$server/utils/file-system";
import type { firestore } from "firebase-admin";
import { resolve } from "path";
import { runSeeder } from "../_fireseed";

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

const seedLayout = async (collection: firestore.CollectionReference) => {
    const layout: Partial = {
        partial: true,
        html: getFileContent(resolve("./seeder/templates/_layout.hbs")),
    };

    const layoutRef = collection.doc("layout");
    const layoutSnapshot = await layoutRef.get();

    const layoutData = layoutSnapshot.data() as Partial | undefined;

    let seed = false;

    if (layoutData?.html !== layout.html) {
        seed = true;
    }

    if (seed) {
        console.info("Seeding templates: layout");

        await layoutRef.set(layout);
    }
};

const seedEmailVerification = async (collection: firestore.CollectionReference) => {
    const emailVerification: Template = {
        subject: "[Releve] Thank you for signing up for the Releve!",
        html: getFileContent(resolve("./seeder/templates/email-verification.hbs")),
        text: "Hi {{name}}, thank you for registering with us. Please visit the link to verify your email address: {{action_url}}. Thank you.",
    };

    const emailVerificationRef = collection.doc("email-verification");
    const emailVerificationSnapshot = await emailVerificationRef.get();

    const emailVerificationData = emailVerificationSnapshot.data() as Template | undefined;

    let seed = false;

    if (emailVerificationData?.subject !== emailVerification.subject) {
        seed = true;
    }
    if (emailVerificationData?.html !== emailVerification.html) {
        seed = true;
    }
    if (emailVerificationData?.text !== emailVerification.text) {
        seed = true;
    }

    if (seed) {
        console.info("Seeding templates: email-verification");

        await emailVerificationRef.set(emailVerification);
    }
};

const seedPasswordReset = async (collection: firestore.CollectionReference) => {
    const resetPassword: Template = {
        subject: "[Releve] Reset your password",
        html: getFileContent(resolve("./seeder/templates/password-reset.hbs")),
        text: "Hi {{name}}, you have requested to reset your password. Please visit the link to reset your password.: {{action_url}}. Thank you.",
    };

    const resetPasswordRef = collection.doc("password-reset");
    const resetPasswordSnapshot = await resetPasswordRef.get();

    const resetPasswordData = resetPasswordSnapshot.data() as Template | undefined;

    let seed = false;

    if (resetPasswordData?.subject !== resetPassword.subject) {
        seed = true;
    }
    if (resetPasswordData?.html !== resetPassword.html) {
        seed = true;
    }
    if (resetPasswordData?.text !== resetPassword.text) {
        seed = true;
    }

    if (seed) {
        console.info("Seeding templates: password-reset");

        await resetPasswordRef.set(resetPassword);
    }
};

const seedShopSubmission = async (collection: firestore.CollectionReference) => {
    const shopSubmission: Template = {
        subject: "[Releve] {{shop.name}} has been submitted for approval",
        html: getFileContent(resolve("./seeder/templates/shop-submission.hbs")),
        text: "New shop has been submitted for approval. Thank you.",
    };

    const shopSubmissionRef = collection.doc("shop-submission");
    const shopSubmissionSnapshot = await shopSubmissionRef.get();

    const shopSubmissionData = shopSubmissionSnapshot.data() as Template | undefined;

    let seed = false;

    if (shopSubmissionData?.subject !== shopSubmission.subject) {
        seed = true;
    }
    if (shopSubmissionData?.html !== shopSubmission.html) {
        seed = true;
    }
    if (shopSubmissionData?.text !== shopSubmission.text) {
        seed = true;
    }

    if (seed) {
        console.info("Seeding templates: shop-submission");

        await shopSubmissionRef.set(shopSubmission);
    }
};

const seedShopStatus = async (collection: firestore.CollectionReference) => {
    const shopStatus: Template = {
        subject:
            "[Releve] {{shop.name}} has been {{#if isPending}}submitted{{/if}}{{#if isApproved}}approved{{/if}}{{#if isRejected}}rejected{{/if}}",
        html: getFileContent(resolve("./seeder/templates/shop-status.hbs")),
        text: "Hi {{name}}, thank for adding your shop. Your shop {{#if isPending}}will be reviewed by our team and will be approved soon{{/if}}{{#if isApproved}}is approved{{/if}}{{#if isRejected}}is rejected{{/if}}. Thank you.",
    };

    const shopStatusRef = collection.doc("shop-status");
    const shopStatusSnapshot = await shopStatusRef.get();

    const shopStatusData = shopStatusSnapshot.data() as Template | undefined;

    let seed = false;

    if (shopStatusData?.subject !== shopStatus.subject) {
        seed = true;
    }
    if (shopStatusData?.html !== shopStatus.html) {
        seed = true;
    }
    if (shopStatusData?.text !== shopStatus.text) {
        seed = true;
    }

    if (seed) {
        console.info("Seeding templates: shop-status");

        await shopStatusRef.set(shopStatus);
    }
};

export default runSeeder(async ({ firestore }) => {
    const collection = firestore.collection("extensions/mail-trigger/templates");

    await seedLayout(collection);

    await seedEmailVerification(collection);

    await seedPasswordReset(collection);

    await seedShopSubmission(collection);

    await seedShopStatus(collection);
}).catch((err) => {
    console.error(err);
});
