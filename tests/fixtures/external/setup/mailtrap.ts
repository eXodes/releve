import type { Locator, Page } from "$tests/utils";
import { expect } from "@playwright/test";

export class Mailtrap {
    private readonly email?: string;
    private readonly password?: string;

    private readonly linkLoginEl: Locator;

    private readonly inputEmailEl: Locator;
    private readonly inputPasswordEl: Locator;

    private readonly linkNextEl: Locator;
    private readonly buttonLoginEl: Locator;

    private readonly linkInboxEl: Locator;

    constructor(public readonly page: Page) {
        this.email = process.env.MAILTRAP_EMAIL;
        this.password = process.env.MAILTRAP_PASSWORD;

        this.linkLoginEl = page.getByRole("link", { name: /Log In/ });

        this.inputEmailEl = page.locator("label", { hasText: /Email/ });
        this.linkNextEl = page.locator("a", { hasText: /Next/ });

        this.inputPasswordEl = page.locator("label", { hasText: /Password/ });
        this.buttonLoginEl = page.locator("input", { hasText: /Log In/ });

        this.linkInboxEl = page.locator("a", { hasText: /My Inbox/ });
    }

    async goto() {
        await this.page.goto("https://mailtrap.io");
    }

    async loginToInbox() {
        if (!this.email) throw new Error("MAILTRAP_EMAIL is not defined");
        if (!this.password) throw new Error("MAILTRAP_PASSWORD is not defined");

        await this.linkLoginEl.click();
        await this.page.waitForURL("**/signin");

        await this.inputEmailEl.waitFor();
        await this.inputEmailEl.fill(this.email);
        await this.linkNextEl.click();
        await this.linkInboxEl.waitFor({ state: "detached" });

        await this.inputPasswordEl.waitFor();
        await this.inputPasswordEl.fill(this.password);
        await this.buttonLoginEl.click();

        await this.page.waitForURL("**/home");

        await this.linkInboxEl.waitFor();

        await this.linkInboxEl.click();

        await this.page.waitForURL("**/messages");
    }

    async verifyEmail() {
        const registerEmailLinkEl = this.page.locator("a", {
            hasText: /Thank you for signing up for the Releve!/,
        });
        await registerEmailLinkEl.waitFor();
        await expect(registerEmailLinkEl).toBeVisible();
        await registerEmailLinkEl.click();

        await this.page.waitForSelector("#html_tabpanel");
        const iframe = this.page.frameLocator('[data-test-id="message_view_iframe"]');

        const verifyEmailLinkEl = iframe.locator("a", { hasText: /Verify email/ });
        await verifyEmailLinkEl.waitFor();
        await expect(verifyEmailLinkEl).toBeVisible();

        const [newpage] = await Promise.all([
            this.page.waitForEvent("popup"),
            await verifyEmailLinkEl.click(),
        ]);
        await newpage.waitForURL("**/sign-in?uid=**");

        const verifiedMessageEl = this.page.locator("p", {
            hasText: /Email verified successfully. Please sign in./,
        });
        await verifiedMessageEl.waitFor();
        await expect(verifiedMessageEl).toBeVisible();
    }
}
