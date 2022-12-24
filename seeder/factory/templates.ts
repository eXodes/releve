import { runSeeder } from "../_fireseed";
import { getFileContent } from "$utils/file-system";
import { resolve } from "path";

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

export default runSeeder(async ({ firestore }) => {
    const collection = firestore.collection("extensions/mail-trigger/templates");

    const layout: Partial = {
        partial: true,
        html: getFileContent(resolve("./seeder/templates/_layout.hbs")),
    };

    const layoutRef = collection.doc("layout");
    const layoutData = await layoutRef.get();

    const layoutHtml = layoutData.data()?.html as string;

    if (layoutHtml !== layout.html) {
        console.info("Seeding templates: layout");

        await layoutRef.set(layout);
    }

    const emailVerification: Template = {
        subject: "Thank you for signing up for the Releve!",
        html: getFileContent(resolve("./seeder/templates/email-verification.hbs")),
        text: "Hi {{name}}, thank you for registering with us. Please visit the link to verify your email address: {{action_url}}. Thank you.",
    };

    const emailVerificationRef = collection.doc("email-verification");
    const emailVerificationData = await emailVerificationRef.get();

    const emailVerificationHtml = emailVerificationData.data()?.html as string;

    if (emailVerificationHtml !== emailVerification.html) {
        console.info("Seeding templates: email-verification");

        await emailVerificationRef.set(emailVerification);
    }

    const resetPassword: Template = {
        subject: "Reset your password",
        html: getFileContent(resolve("./seeder/templates/password-reset.hbs")),
        text: "Hi {{name}}, you have requested to reset your password. Please visit the link to reset your password.: {{action_url}}. Thank you.",
    };

    const resetPasswordRef = collection.doc("password-reset");
    const resetPasswordData = await resetPasswordRef.get();

    const resetPasswordHtml = resetPasswordData.data()?.html as string;

    if (resetPasswordHtml !== resetPassword.html) {
        console.info("Seeding templates: password-reset");

        await resetPasswordRef.set(resetPassword);
    }
}).catch((err) => {
    console.error(err);
});
