import { type ShopPayload } from "$features/shops/validations/shop";
import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class BaseLayoutPage {
    private readonly navHomeEl: Locator;
    private readonly navMyShopsEl: Locator;

    private readonly buttonUserMenuEl: Locator;
    private readonly menuSettingsEl: Locator;
    private readonly menuSignOutEl: Locator;
    private readonly toastSignOutSuccessEl: Locator;

    private readonly buttonAddShopModalEl: Locator;
    private readonly modalAddShopEl: Locator;
    private readonly modalAddShopHeadingEl: Locator;
    private readonly modalAddShopDescriptionEl: Locator;
    private readonly modalAddShopButtonCloseEl: Locator;
    private readonly modalAddShopInputNameEl: Locator;
    private readonly modalAddShopDropdownStatusEl: Locator;
    private readonly modalAddShopInputLinkEl: Locator;
    private readonly modalAddShopDropdownCategoriesEl: Locator;
    private readonly modalAddShopDropdownDeliveryServicesEl: Locator;
    private readonly modalAddShopDropdownCountryEl: Locator;
    private readonly modalAddShopInputStreetAddressEl: Locator;
    private readonly modalAddShopInputCityEl: Locator;
    private readonly modalAddShopDropdownStateEl: Locator;
    private readonly modalAddShopInputPostcodeEl: Locator;
    private readonly modalAddShopInputPrivateEl: Locator;
    private readonly modalAddShopButtonSaveEl: Locator;

    constructor(public readonly page: Page) {
        this.navHomeEl = page.getByRole("link", { name: /Home/ });
        this.navMyShopsEl = page.getByRole("link", { name: /My Shops/ });

        this.buttonUserMenuEl = page.getByRole("button", { name: /Open user menu/ });
        this.menuSettingsEl = page.getByRole("menuitem", { name: /Settings/ });
        this.menuSignOutEl = page.getByRole("menuitem", { name: /Sign Out/ });
        this.toastSignOutSuccessEl = page.getByText(/Successfully logged out./);

        this.buttonAddShopModalEl = page.getByRole("button", { name: /Add shop/ });
        this.modalAddShopEl = page.getByRole("dialog", { name: /New Shop Form Modal/ });
        this.modalAddShopHeadingEl = this.modalAddShopEl.getByRole("heading", {
            name: /Shop Details/,
        });
        this.modalAddShopDescriptionEl = this.modalAddShopEl.getByText(
            /Shop details are used to identify your shop./
        );
        this.modalAddShopButtonCloseEl = this.modalAddShopEl.getByRole("button", { name: /Close/ });
        this.modalAddShopInputNameEl = this.modalAddShopEl.getByRole("textbox", { name: /Name/ });
        this.modalAddShopDropdownStatusEl = this.modalAddShopEl.getByRole("button", {
            name: /Status/,
        });
        this.modalAddShopInputLinkEl = this.modalAddShopEl.getByRole("textbox", { name: /Link/ });
        this.modalAddShopDropdownCategoriesEl = this.modalAddShopEl.getByRole("button", {
            name: /Categories/,
        });
        this.modalAddShopDropdownDeliveryServicesEl = this.modalAddShopEl.getByRole("button", {
            name: /Delivery services/,
        });
        this.modalAddShopDropdownCountryEl = this.modalAddShopEl.getByRole("button", {
            name: /Country/,
        });
        this.modalAddShopDropdownCountryEl = this.modalAddShopEl.getByRole("button", {
            name: /Country/,
        });
        this.modalAddShopInputStreetAddressEl = this.modalAddShopEl.getByRole("textbox", {
            name: /Street address/,
        });
        this.modalAddShopInputCityEl = this.modalAddShopEl.getByRole("textbox", { name: /City/ });
        this.modalAddShopDropdownStateEl = this.modalAddShopEl.getByRole("button", {
            name: /State \/ Province/,
        });
        this.modalAddShopInputPostcodeEl = this.modalAddShopEl.getByRole("textbox", {
            name: /ZIP \/ Postal code/,
        });
        this.modalAddShopInputPrivateEl = this.modalAddShopEl.getByRole("checkbox", {
            name: /Make it private/,
        });
        this.modalAddShopButtonSaveEl = this.modalAddShopEl.getByRole("button", { name: /Save/ });
    }

    async navigateToHome() {
        await this.navHomeEl.waitFor();
        await this.navHomeEl.click();

        await this.page.waitForURL("/");
    }

    async navigateToMyShops() {
        await this.navMyShopsEl.waitFor();
        await this.navMyShopsEl.click();

        await this.page.waitForURL("/my/shops");
    }

    async viewUserSettings() {
        await this.buttonUserMenuEl.waitFor();
        await this.buttonUserMenuEl.click();

        await this.menuSettingsEl.waitFor();
        await this.menuSettingsEl.click();

        await this.page.waitForURL("/settings");
    }

    async signOut() {
        await this.buttonUserMenuEl.waitFor();
        await this.buttonUserMenuEl.click();

        await this.menuSignOutEl.waitFor();
        await this.menuSignOutEl.click();

        await this.toastSignOutSuccessEl.waitFor();
        await expect(this.toastSignOutSuccessEl).toBeVisible();
    }

    async openNewShopModal() {
        await this.buttonAddShopModalEl.waitFor();
        await this.buttonAddShopModalEl.click();

        await this.modalAddShopEl.waitFor();
        await expect(this.modalAddShopEl).toBeVisible();

        await this.modalAddShopHeadingEl.waitFor();
        await expect(this.modalAddShopHeadingEl).toBeVisible();

        await this.modalAddShopDescriptionEl.waitFor();
        await expect(this.modalAddShopDescriptionEl).toBeVisible();

        await this.modalAddShopButtonSaveEl.waitFor();
        await expect(this.modalAddShopButtonSaveEl).not.toBeEnabled();
    }

    async closeNewShopModal() {
        await this.modalAddShopButtonCloseEl.waitFor();
        await this.modalAddShopButtonCloseEl.click();

        await expect(this.modalAddShopHeadingEl).not.toBeVisible();
    }

    async fillNewShopForm(
        shop: Omit<ShopPayload, "status" | "role" | "private"> & {
            status?: string;
            private: boolean;
        }
    ) {
        await this.modalAddShopInputNameEl.waitFor();
        await this.modalAddShopInputNameEl.fill(shop.name);

        if (shop.status) {
            await this.modalAddShopDropdownStatusEl.waitFor();
            await this.modalAddShopDropdownStatusEl.click().then(async () => {
                await this.modalAddShopEl
                    .getByRole("option", { name: shop.status, exact: true })
                    .click();
            });
        }

        await this.modalAddShopInputLinkEl.waitFor();
        await this.modalAddShopInputLinkEl.fill(shop.link);

        await this.modalAddShopDropdownCategoriesEl.waitFor();
        await this.modalAddShopDropdownCategoriesEl.click().then(async () => {
            for (const category of shop.categories) {
                await this.modalAddShopEl
                    .getByRole("option", { name: category, exact: true })
                    .click();
            }
        });

        await this.modalAddShopDropdownDeliveryServicesEl.waitFor();
        await this.modalAddShopDropdownDeliveryServicesEl.click().then(async () => {
            for (const deliveryProvider of shop.deliveryProviders) {
                await this.modalAddShopEl
                    .getByRole("option", { name: deliveryProvider, exact: true })
                    .click();
            }
        });

        await this.modalAddShopDropdownCountryEl.waitFor();
        await this.modalAddShopDropdownCountryEl.click().then(async () => {
            await this.modalAddShopEl
                .getByRole("option", { name: shop.country, exact: true })
                .click();
        });

        await this.modalAddShopInputStreetAddressEl.waitFor();
        await this.modalAddShopInputStreetAddressEl.fill(shop.streetAddress);

        await this.modalAddShopInputCityEl.waitFor();
        await this.modalAddShopInputCityEl.fill(shop.city);

        await this.modalAddShopDropdownStateEl.waitFor();
        await this.modalAddShopDropdownStateEl.click().then(async () => {
            await this.modalAddShopEl
                .getByRole("option", { name: shop.state, exact: true })
                .click();
        });

        await this.modalAddShopInputPostcodeEl.waitFor();
        await this.modalAddShopInputPostcodeEl.fill(shop.postalCode);

        if (shop.private) {
            await this.modalAddShopInputPrivateEl.waitFor();
            await this.modalAddShopInputPrivateEl.check();
        }
    }

    async saveNewShopForm() {
        await expect(this.modalAddShopButtonSaveEl).toBeEnabled();
        await this.modalAddShopButtonSaveEl.click();

        await expect(this.modalAddShopEl).not.toBeVisible();
    }
}
