import { test } from "../../fixtures";

test("should be able to view the page", async ({ signInPage }) => {
    await signInPage.isSignInPage();
});

test("should be able to go to sign up page", async ({ signInPage }) => {
    await signInPage.clickSignUp();
});

test("should be able to go to forgot password page", async ({ signInPage }) => {
    await signInPage.clickForgotPassword();
});

test("should show unregistered account error", async ({ signInPage }) => {
    await signInPage.fillForm({
        email: "unregistered@test.io",
        password: "test-password",
    });

    await signInPage.submitUnregistered();
});

test("should show invalid password error", async ({ signInPage }) => {
    await signInPage.fillForm({
        email: "admin@test.io",
        password: "wrong-password",
    });

    await signInPage.submitInvalidPassword();
});

test("should be able to sign in", async ({ signInPage }) => {
    await signInPage.fillForm({
        email: "admin@test.io",
        password: "test-password",
    });

    await signInPage.submitSuccess();
});
