import { expect, type Locator, type Page } from "$tests/utils";

export class SignUpPage {
    private readonly headingEl: Locator;
    private readonly linkSignInEl: Locator;
    private readonly linkForgotPasswordEl: Locator;

    private readonly buttonValidationEl: Locator;
    private readonly emailValidationMessageEl: Locator;

    private readonly inputNameEl: Locator;
    private readonly inputEmailEl: Locator;
    private readonly inputPasswordEl: Locator;
    private readonly inputConfirmPasswordEl: Locator;
    private readonly buttonSignUpEl: Locator;

    private readonly successMessageEl: Locator;

    constructor(public readonly page: Page) {
        this.headingEl = page.getByRole("heading", { name: /Register a free account/ });
        this.linkSignInEl = page.getByRole("link", { name: /sign in to your account/ });
        this.linkForgotPasswordEl = page.getByRole("link", { name: /Forgot your password?/ });

        this.buttonValidationEl = page.getByRole("button", { name: /Show validation error/ });
        this.emailValidationMessageEl = page.locator("p", {
            hasText: /Email is already registered./,
        });

        this.inputNameEl = page.getByRole("textbox", { name: /Display name/ });
        this.inputEmailEl = page.getByRole("textbox", { name: /Email address/ });
        this.inputPasswordEl = page.getByRole("textbox", { name: /Password/ });
        this.inputConfirmPasswordEl = page.getByRole("textbox", { name: /Confirm password/ });
        this.buttonSignUpEl = page.getByRole("button", { name: /Sign up/ });

        this.successMessageEl = page.locator("p", {
            hasText: /Sign up successful. Please check your email for a verification link./,
        });
    }

    async goto() {
        await this.page.goto("/sign-up");
    }

    async isSignUpPage() {
        await expect(this.page).toHaveTitle("Sign Up");
        await expect(this.headingEl).toBeVisible();
        await expect(this.linkSignInEl).toBeVisible();
        await expect(this.linkForgotPasswordEl).toBeVisible();

        await expect(this.inputNameEl).toBeVisible();
        await expect(this.inputEmailEl).toBeVisible();
        await expect(this.inputPasswordEl).toBeVisible();
        await expect(this.inputConfirmPasswordEl).toBeVisible();
        await expect(this.buttonSignUpEl).toBeVisible();
    }

    async clickSignIn() {
        await this.linkSignInEl.click();

        await this.page.waitForURL("/sign-in");
    }

    async clickForgotPassword() {
        await this.linkForgotPasswordEl.click();

        await this.page.waitForURL("/forgot-password");
    }

    async fillForm({ name, email, password }: { name: string; email: string; password: string }) {
        await this.inputNameEl.fill(name);
        await this.inputEmailEl.fill(email);
        await this.inputPasswordEl.fill(password);
        await this.inputConfirmPasswordEl.fill(password);

        await expect(this.inputNameEl).toHaveValue(name);
        await expect(this.inputEmailEl).toHaveValue(email);
        await expect(this.inputPasswordEl).toHaveValue(password);
        await expect(this.inputConfirmPasswordEl).toHaveValue(password);
    }

    async showExistingEmailError() {
        await this.buttonValidationEl.waitFor();
        await expect(this.buttonValidationEl).toBeVisible();
        await this.buttonValidationEl.click();

        await this.emailValidationMessageEl.waitFor();
        await expect(this.emailValidationMessageEl).toBeVisible();
    }

    async submitSuccess() {
        await this.buttonSignUpEl.click();

        await this.successMessageEl.waitFor();
        await expect(this.successMessageEl).toBeVisible();
    }
}
