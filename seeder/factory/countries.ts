import type { CountryData } from "$types/countries";

import { runSeeder } from "../_fireseed";
import { getFile } from "$utils/file-system";
import { resolve } from "path";

export default runSeeder(async ({ firestore }) => {
    const path = resolve("./seeder/json/countries.json");

    const countries: CountryData[] = JSON.parse(getFile(path) as string);

    const collection = firestore.collection("countries");

    const snapshots = await collection.get();

    if (snapshots.empty) {
        console.info("Seeding countries...");

        for (const country of countries) {
            const batch = firestore.batch();

            const countryRef = collection.doc();

            batch.set(countryRef, {
                name: country.name,
                iso2: country.iso2,
                iso3: country.iso3,
                numericCode: country.numeric_code,
                phoneCode: country.phone_code,
                capital: country.capital,
                currency: country.currency,
                currencyName: country.currency_name,
                currencySymbol: country.currency_symbol,
                native: country.native,
                region: country.region,
                subregion: country.subregion,
                timezones: country.timezones,
                emoji: country.emoji,
            });

            const stateCollection = countryRef.collection("states");

            for (const state of country.states) {
                const stateRef = stateCollection.doc();

                batch.set(stateRef, {
                    id: state.id,
                    name: state.name,
                    state_code: state.state_code,
                    latitude: state.latitude,
                    longitude: state.longitude,
                });
            }

            await batch.commit();
        }
    }
}).catch((err) => {
    console.error(err);
});
