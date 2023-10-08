import { test as base } from "@playwright/test";
import { SignInPage, SignUpPage } from "./auth";

type PageFixtures = {
    signInPage: SignInPage;
    signUpPage: SignUpPage;
};

export const test = base.extend<PageFixtures>({
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
});

export { expect } from "@playwright/test";
