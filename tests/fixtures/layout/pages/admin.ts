import { BaseLayoutPage } from "$tests/fixtures/layout/pages/base";
import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class AdminLayoutPage extends BaseLayoutPage {
    private readonly navShopsEl: Locator;
    private readonly navUsersEl: Locator;

    private readonly toastAddShopSuccessEl: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.navShopsEl = page.getByRole("link", { name: /Shop Management/ });
        this.navUsersEl = page.getByRole("link", { name: /User Management/ });

        this.toastAddShopSuccessEl = page.getByText(/Shop added successfully./);
    }

    async navigateToShopsManagement() {
        await this.navShopsEl.waitFor();
        await this.navShopsEl.click();

        await this.page.waitForURL("/shops");
    }

    async navigateToUsersManagement() {
        await this.navUsersEl.waitFor();
        await this.navUsersEl.click();

        await this.page.waitForURL("/users");
    }

    async saveNewShopSuccess() {
        await this.toastAddShopSuccessEl.waitFor();
        await expect(this.toastAddShopSuccessEl).toBeVisible();
        await expect(this.toastAddShopSuccessEl).toBeVisible();
    }
}
