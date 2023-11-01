import { test } from "$tests/utils";

test("should be able to view the page", async ({ signUpPage }) => {
    await signUpPage.isSignUpPage();
});

test("should be able to go to sign in page", async ({ signUpPage }) => {
    await signUpPage.clickSignIn();
});

test("should be able to go to forgot password page", async ({ signUpPage }) => {
    await signUpPage.clickForgotPassword();
});

test("should show existing email error", async ({ signUpPage }) => {
    await signUpPage.fillForm({
        name: "Test Normal User",
        email: "normal-user@test.io",
        password: "t3st-Password",
    });

    await signUpPage.showExistingEmailError();
});

test("should be able to sign up", async ({ signUpPage }) => {
    await signUpPage.fillForm({
        name: "Test New User",
        email: "new-user@test.io",
        password: "t3st-Password",
    });

    await signUpPage.submitSuccess();
});
