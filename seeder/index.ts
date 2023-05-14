import "./config";

(async () => {
    const admin = await import("./factory/admin").then(({ default: admin }) => admin);
    const assets = await import("./factory/assets").then(({ default: assets }) => assets);
    const categories = await import("./factory/categories").then(
        ({ default: categories }) => categories
    );
    const countries = await import("./factory/countries").then(
        ({ default: countries }) => countries
    );
    const deliveryProviders = await import("./factory/delivery-providers").then(
        ({ default: deliveryServices }) => deliveryServices
    );
    const templates = await import("./factory/templates").then(
        ({ default: templates }) => templates
    );

    Promise.all([admin, assets, categories, countries, deliveryProviders, templates])
        .then(() => {
            console.info("Seeding completed");
        })
        .catch((err) => {
            console.error(err);
        });
})();
