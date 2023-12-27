import { BaseLayoutPage } from "$tests/fixtures/layout/pages/base";
import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class UserLayoutPage extends BaseLayoutPage {
    private readonly navShopsEl: Locator;
    private readonly navUsersEl: Locator;

    private readonly toastAddShopSuccessEl: Locator;

    constructor(public readonly page: Page) {
        super(page);

        this.toastAddShopSuccessEl = page.getByText(/Shop has been submitted for approval./);
    }

    async saveNewShopSuccess() {
        await this.toastAddShopSuccessEl.waitFor();
        await expect(this.toastAddShopSuccessEl).toBeVisible();
        await expect(this.toastAddShopSuccessEl).toBeVisible();
    }
}
