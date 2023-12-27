import { test } from "$tests/utils";

test("should be able to navigate to Homepage", async ({ adminLayoutPage }) => {
    await adminLayoutPage.navigateToHome();
});

test("should be able to navigate to My Shops", async ({ adminLayoutPage }) => {
    await adminLayoutPage.navigateToMyShops();
});

test("should be able to navigate to Shops Management", async ({ adminLayoutPage }) => {
    await adminLayoutPage.navigateToShopsManagement();
});

test("should be able to navigate to Users Management", async ({ adminLayoutPage }) => {
    await adminLayoutPage.navigateToUsersManagement();
});

test("should be able to view settings", async ({ adminLayoutPage }) => {
    await adminLayoutPage.viewSettings();
});

test("should be able to close new shop modal", async ({ adminLayoutPage }) => {
    await adminLayoutPage.cancelAddNewShop();
});

test("should be able to add new shop", async ({ adminLayoutPage }) => {
    await adminLayoutPage.addNewShop({
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
});
