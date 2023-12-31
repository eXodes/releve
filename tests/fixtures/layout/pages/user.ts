import { BaseLayoutPage } from "$tests/fixtures/layout/pages/base";
import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class UserLayoutPage extends BaseLayoutPage {
    private readonly toastAddShopSuccessEl: Locator;

    constructor(public readonly page: Page) {
        super(page);

        this.toastAddShopSuccessEl = page.getByText(/Shop has been submitted for approval./);
    }

    async navigateToMyShops() {
        await this.navMyShopsEl.waitFor();
        await this.navMyShopsEl.click();

        await this.page.waitForURL("/my/shops");
    }

    async navigateToShopsStatus() {
        await this.navShopsStatusEl.waitFor();
        await this.navShopsStatusEl.click();

        await this.page.waitForURL("/my/status");
    }

    async navigateToShopsManagement() {
        await this.navShopsEl.waitFor({ state: "detached" });
        await expect(this.navShopsEl).not.toBeVisible();
    }

    async navigateToUsersManagement() {
        await this.navUsersEl.waitFor({ state: "detached" });
        await expect(this.navUsersEl).not.toBeVisible();
    }

    async saveNewShopSuccess() {
        await this.toastAddShopSuccessEl.waitFor();
        await expect(this.toastAddShopSuccessEl).toBeVisible();
        await expect(this.toastAddShopSuccessEl).toBeVisible();
    }
}
