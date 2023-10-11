import type { Page, Locator } from "@playwright/test";
import { expect } from "../index";

export class SignInPage {
    private readonly headingEl: Locator;
    private readonly linkSignUpEl: Locator;
    private readonly linkForgotPasswordEl: Locator;

    private readonly inputEmailEl: Locator;
    private readonly inputPasswordEl: Locator;
    private readonly checkboxRememberEl: Locator;
    private readonly buttonSignInEl: Locator;

    private readonly successMessageEl: Locator;
    private readonly unregisteredMessageEl: Locator;
    private readonly unverifiedMessageEl: Locator;
    private readonly invalidPasswordMessageEl: Locator;

    constructor(public readonly page: Page) {
        this.headingEl = page.getByRole("heading", { name: /Sign in to your account/ });
        this.linkSignUpEl = page.getByRole("link", { name: /sign up for a free account/ });
        this.linkForgotPasswordEl = page.getByRole("link", { name: /Forgot your password?/ });

        this.inputEmailEl = page.getByRole("textbox", { name: /Email address/ });
        this.inputPasswordEl = page.getByRole("textbox", { name: /Password/ });
        this.checkboxRememberEl = page.getByRole("checkbox", { name: /Remember me/ });
        this.buttonSignInEl = page.getByRole("button", { name: /Sign in/ });

        this.successMessageEl = page.locator("p", { hasText: /Sign in successful./ });
        this.unregisteredMessageEl = page.locator("p", {
            hasText: /No registered user found with this email address./,
        });
        this.unverifiedMessageEl = page.locator("p", { hasText: /Email not verified./ });
        this.invalidPasswordMessageEl = page.locator("p", {
            hasText: /Sign in failed. Please check your email and password./,
        });
    }

    async goto() {
        await this.page.goto("/sign-in");
    }

    async isSignInPage() {
        await expect(this.page).toHaveTitle("Sign In");
        await expect(this.headingEl).toBeVisible();
        await expect(this.linkSignUpEl).toBeVisible();
        await expect(this.linkForgotPasswordEl).toBeVisible();

        await expect(this.inputEmailEl).toBeVisible();
        await expect(this.inputPasswordEl).toBeVisible();
        await expect(this.checkboxRememberEl).toBeVisible();
        await expect(this.buttonSignInEl).toBeVisible();
    }

    async clickSignUp() {
        await this.linkSignUpEl.click();

        await this.page.waitForURL("/sign-up");
    }

    async clickForgotPassword() {
        await this.linkForgotPasswordEl.click();

        await this.page.waitForURL("/forgot-password");
    }

    async fillForm({
        email,
        password,
        remember,
    }: {
        email: string;
        password: string;
        remember?: boolean;
    }) {
        await this.inputEmailEl.fill(email);
        await this.inputPasswordEl.fill(password);

        if (remember) {
            await this.checkboxRememberEl.check();
        }

        await expect(this.inputEmailEl).toHaveValue(email);
        await expect(this.inputPasswordEl).toHaveValue(password);

        if (remember) {
            await expect(this.checkboxRememberEl).toBeChecked();
        }
    }

    async submitUnregistered() {
        await this.buttonSignInEl.click();

        await this.unregisteredMessageEl.waitFor();

        await expect(this.unregisteredMessageEl).toBeVisible();
    }

    async submitInvalidPassword() {
        await this.buttonSignInEl.click();

        await this.invalidPasswordMessageEl.waitFor();

        await expect(this.invalidPasswordMessageEl).toBeVisible();
    }

    async submitSuccess() {
        await this.buttonSignInEl.click();

        await this.successMessageEl.waitFor();
        await expect(this.successMessageEl).toBeVisible();

        await this.page.waitForURL("/");
    }
}
