import { BaseLayoutPage } from "$tests/fixtures/layout/pages/base";
import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class GuestLayoutPage extends BaseLayoutPage {
    public readonly buttonSignInEl: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.buttonSignInEl = page.getByRole("link", { name: /Sign in/ });
    }

    async navigateToMyShops() {
        await this.navMyShopsEl.waitFor({ state: "detached" });
        await expect(this.navMyShopsEl).not.toBeVisible();
    }

    async navigateToShopsStatus() {
        await this.navShopsStatusEl.waitFor({ state: "detached" });
        await expect(this.navShopsStatusEl).not.toBeVisible();
    }

    async navigateToShopsManagement() {
        await this.navShopsEl.waitFor({ state: "detached" });
        await expect(this.navShopsEl).not.toBeVisible();
    }

    async navigateToUsersManagement() {
        await this.navUsersEl.waitFor({ state: "detached" });
        await expect(this.navUsersEl).not.toBeVisible();
    }

    async navigateToSignIn() {
        await this.buttonSignInEl.waitFor();
        await this.buttonSignInEl.click();

        await this.page.waitForURL("/sign-in");
    }
}
