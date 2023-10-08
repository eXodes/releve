import { test } from "../../fixtures";

test("should be able to view the page", async ({ signUpPage }) => {
    await signUpPage.isSignUpPage();
});

test("should be able to go to sign in page", async ({ signUpPage }) => {
    await signUpPage.clickSignIn();
});

test("should be able to go to forgot password page", async ({ signUpPage }) => {
    await signUpPage.clickForgotPassword();
});

test("should be able to sign up", async ({ signUpPage }) => {
    await signUpPage.fillForm({
        name: "Test User",
        email: "user@test.io",
        password: "UserP@ssw0rd",
    });

    await signUpPage.submitSuccess();
});
