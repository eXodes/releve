import { test as base } from "@playwright/test";
import { Mailtrap } from "$tests/fixtures/external";
import { SignInPage, SignUpPage } from "$tests/fixtures/auth";
import { AdminLayoutPage, GuestLayoutPage, UserLayoutPage } from "$tests/fixtures/layout";

type PageFixtures = {
    mailtrap: Mailtrap;
    signInPage: SignInPage;
    signUpPage: SignUpPage;
    adminLayoutPage: AdminLayoutPage;
    userLayoutPage: UserLayoutPage;
    guestLayoutPage: GuestLayoutPage;
};

const test = base.extend<PageFixtures>({
    mailtrap: async ({ page }, use) => {
        const mailtrap = new Mailtrap(page);

        await mailtrap.goto();
        await mailtrap.loginToInbox();

        await use(mailtrap);
    },
    signInPage: async ({ page }, use) => {
        const signInPage = new SignInPage(page);

        await signInPage.goto();

        await use(signInPage);
    },
    signUpPage: async ({ page }, use) => {
        const signUpPage = new SignUpPage(page);

        await signUpPage.goto();

        await use(signUpPage);
    },
    adminLayoutPage: async ({ page }, use) => {
        const signInPage = new SignInPage(page);

        await signInPage.goto();

        await signInPage.signInAsAdmin();

        const adminLayoutPage = new AdminLayoutPage(page);

        await adminLayoutPage.goto();

        await use(adminLayoutPage);
    },
    userLayoutPage: async ({ page }, use) => {
        const signInPage = new SignInPage(page);

        await signInPage.goto();

        await signInPage.signInAsUser();

        const userLayoutPage = new UserLayoutPage(page);

        await userLayoutPage.goto();

        await use(userLayoutPage);
    },
    guestLayoutPage: async ({ page }, use) => {
        const guestLayoutPage = new GuestLayoutPage(page);

        await guestLayoutPage.goto();

        await use(guestLayoutPage);
    },
});

export * from "@playwright/test";
export { test };
