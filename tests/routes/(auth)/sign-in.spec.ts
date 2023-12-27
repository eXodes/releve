import { test } from "$tests/utils";

test.describe("Navigation", () => {
    test("should be able to view the page", async ({ signInPage }) => {
        await signInPage.isSignInPage();
    });

    test("should be able to go to sign up page", async ({ signInPage }) => {
        await signInPage.clickSignUp();
    });

    test("should be able to go to forgot password page", async ({ signInPage }) => {
        await signInPage.clickForgotPassword();
    });
});

test.describe("Validation", () => {
    test("should show unregistered account error", async ({ signInPage }) => {
        await signInPage.fillForm({
            email: "unregistered-user@test.io",
            password: "t3st-Password",
        });

        await signInPage.submitUnregistered();
    });

    test("should show unverified account error", async ({ signInPage }) => {
        await signInPage.fillForm({
            email: "unverified-user@test.io",
            password: "t3st-Password",
        });

        await signInPage.submitUnverified();
    });

    test("should show invalid password error", async ({ signInPage }) => {
        await signInPage.fillForm({
            email: "normal-user@test.io",
            password: "wr0ng-Password",
        });

        await signInPage.submitInvalidPassword();
    });

    test("should show invalid action code error", async ({ signInPage }) => {
        await signInPage.showInvalidActionCode();
    });
});

test.describe("User Flow", () => {
    test("should be able to sign in", async ({ signInPage }) => {
        await signInPage.fillForm({
            email: "normal-user@test.io",
            password: "t3st-Password",
        });

        await signInPage.submitSuccess();
    });
});
