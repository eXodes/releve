import { test } from "$tests/utils";

test.describe("Admin", () => {
    test.describe("Navigation", () => {
        test("should be able to navigate to Homepage", async ({ adminLayoutPage }) => {
            await adminLayoutPage.navigateToHome();
        });

        test("should be able to navigate to My Shops", async ({ adminLayoutPage }) => {
            await adminLayoutPage.navigateToMyShops();
        });

        test("should not be able to navigate to Shops Status", async ({ adminLayoutPage }) => {
            await adminLayoutPage.navigateToShopsStatus();
        });

        test("should be able to navigate to Shops Management", async ({ adminLayoutPage }) => {
            await adminLayoutPage.navigateToShopsManagement();
        });

        test("should be able to navigate to Users Management", async ({ adminLayoutPage }) => {
            await adminLayoutPage.navigateToUsersManagement();
        });
    });

    test.describe("Actions", () => {
        test.describe.configure({ mode: "serial" });

        test("should be able to add new shop as admin", async ({ adminLayoutPage }) => {
            await adminLayoutPage.openNewShopModal();
            await adminLayoutPage.fillNewShopForm({
                name: "Shop 1",
                link: "shop.one",
                categories: ["Apparel", "Automotive"],
                deliveryProviders: ["Aramex", "Lalamove"],
                streetAddress: "Jalan Telawi",
                city: "Bangsar",
                state: "Kuala Lumpur",
                postalCode: "51000",
                country: "Malaysia",
                status: "Approved",
                private: false,
            });
            await adminLayoutPage.saveNewShopForm();
            await adminLayoutPage.saveNewShopSuccess();
        });

        test("should be able to close new shop modal", async ({ adminLayoutPage }) => {
            await adminLayoutPage.openNewShopModal();
            await adminLayoutPage.closeNewShopModal();
        });

        test("should be able to view settings", async ({ adminLayoutPage }) => {
            await adminLayoutPage.viewUserSettings();
        });

        test("should be able to sign out", async ({ adminLayoutPage }) => {
            await adminLayoutPage.signOut();
        });
    });
});

test.describe("User", () => {
    test.describe("Navigation", () => {
        test("should be able to navigate to Homepage", async ({ userLayoutPage }) => {
            await userLayoutPage.navigateToHome();
        });

        test("should be able to navigate to My Shops", async ({ userLayoutPage }) => {
            await userLayoutPage.navigateToMyShops();
        });

        test("should be able to navigate to Shops Status", async ({ userLayoutPage }) => {
            await userLayoutPage.navigateToShopsStatus();
        });

        test("should not be able to navigate to Shops Management", async ({ userLayoutPage }) => {
            await userLayoutPage.navigateToShopsManagement();
        });

        test("should not be able to navigate to Users Management", async ({ userLayoutPage }) => {
            await userLayoutPage.navigateToUsersManagement();
        });
    });

    test.describe("Actions", () => {
        test.describe.configure({ mode: "serial" });

        test("should be able to add new shop as user", async ({ userLayoutPage }) => {
            await userLayoutPage.openNewShopModal();
            await userLayoutPage.fillNewShopForm({
                name: "Shop 1",
                link: "shop.one",
                categories: ["Apparel", "Automotive"],
                deliveryProviders: ["Aramex", "Lalamove"],
                streetAddress: "Jalan Telawi",
                city: "Bangsar",
                state: "Kuala Lumpur",
                postalCode: "51000",
                country: "Malaysia",
                private: false,
            });
            await userLayoutPage.saveNewShopForm();
            await userLayoutPage.saveNewShopSuccess();
        });

        test("should be able to close new shop modal", async ({ userLayoutPage }) => {
            await userLayoutPage.openNewShopModal();
            await userLayoutPage.closeNewShopModal();
        });

        test("should be able to view settings", async ({ userLayoutPage }) => {
            await userLayoutPage.viewUserSettings();
        });

        test("should be able to sign out", async ({ userLayoutPage }) => {
            await userLayoutPage.signOut();
        });
    });
});

test.describe("Guest", () => {
    test.describe("Navigation", () => {
        test("should be able to navigate to Homepage", async ({ guestLayoutPage }) => {
            await guestLayoutPage.navigateToHome();
        });

        test("should not be able to navigate to My Shops", async ({ guestLayoutPage }) => {
            await guestLayoutPage.navigateToMyShops();
        });

        test("should not be able to navigate to Shops Status", async ({ guestLayoutPage }) => {
            await guestLayoutPage.navigateToShopsStatus();
        });

        test("should not be able to navigate to Shops Management", async ({ guestLayoutPage }) => {
            await guestLayoutPage.navigateToShopsManagement();
        });

        test("should not be able to navigate to Users Management", async ({ guestLayoutPage }) => {
            await guestLayoutPage.navigateToUsersManagement();
        });

        test("should be able to navigate to Sign In", async ({ guestLayoutPage }) => {
            await guestLayoutPage.navigateToSignIn();
        });
    });
});
