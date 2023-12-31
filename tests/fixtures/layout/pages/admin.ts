import { BaseLayoutPage } from "$tests/fixtures/layout/pages/base";
import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class AdminLayoutPage extends BaseLayoutPage {
    private readonly toastAddShopSuccessEl: Locator;

    constructor(public readonly page: Page) {
        super(page);

        this.toastAddShopSuccessEl = page.getByText(/Shop added successfully./);
    }

    async navigateToMyShops() {
        await this.navMyShopsEl.waitFor();
        await this.navMyShopsEl.click();

        await this.page.waitForURL("/my/shops");
    }

    async navigateToShopsStatus() {
        await this.navShopsStatusEl.waitFor({ state: "detached" });
        await expect(this.navShopsStatusEl).not.toBeVisible();
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
