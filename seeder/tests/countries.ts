import type { CountryEntity } from "$module/country/country.entity";
import type { StateEntity } from "$module/country/state.entity";
import { getFile } from "$server/utils/file-system";
import { resolve } from "path";

import { runSeeder } from "../_fireseed";

interface CountryData {
    name: string;
    iso3: string;
    iso2: string;
    numeric_code: string;
    phone_code: string;
    capital: string;
    currency: string;
    currency_name: string;
    currency_symbol: string;
    tld: string;
    native: string;
    region: string;
    subregion: string;
    timezones: Array<{
        zoneName: string;
        gmtOffset: number;
        gmtOffsetName: string;
        abbreviation: string;
        tzName: string;
    }>;
    translations: Record<string, string>;
    latitude: string;
    longitude: string;
    emoji: string;
    emojiU: string;
    states: Array<{
        id: number;
        name: string;
        state_code: string;
        latitude: string;
        longitude: string;
        type: string | null;
    }>;
}

const countriesJson = resolve("./seeder/json/countries.json");

export default runSeeder(async ({ firestore }) => {
    const countries: CountryData[] = JSON.parse(getFile(countriesJson) as string);

    const collection = firestore.collection("countries");

    const snapshots = await collection.get();

    if (snapshots.empty) {
        for (const country of countries) {
            const seedCountries = ["Malaysia", "Singapore", "Indonesia"].includes(country.name);

            if (seedCountries) {
                const batch = firestore.batch();

                const countryDoc = await collection.where("name", "==", country.name).get();

                if (countryDoc.empty) {
                    console.info(`Seeding countries: ${country.name}`);

                    const countryRef = collection.doc();

                    const countryEntity: CountryEntity = {
                        name: country.name,
                        iso3: country.iso3,
                        iso2: country.iso2,
                        numericCode: country.numeric_code,
                        phoneCode: country.phone_code,
                        capital: country.capital,
                        currency: country.currency,
                        currencyName: country.currency_name,
                        currencySymbol: country.currency_symbol,
                        tld: country.tld,
                        native: country.native,
                        region: country.region,
                        subregion: country.subregion,
                        timezones: country.timezones,
                        translations: country.translations,
                        latitude: country.latitude,
                        longitude: country.longitude,
                        emoji: country.emoji,
                        emojiU: country.emojiU,
                    };

                    batch.set(countryRef, countryEntity);

                    const stateCollection = countryRef.collection("states");

                    for (const state of country.states) {
                        const stateDoc = await stateCollection
                            .where("name", "==", state.name)
                            .get();

                        if (stateDoc.empty) {
                            const stateRef = stateCollection.doc();

                            const stateData: StateEntity = {
                                id: state.id,
                                name: state.name,
                                stateCode: state.state_code,
                                latitude: state.latitude,
                                longitude: state.longitude,
                                type: state.type,
                            };

                            batch.set(stateRef, {
                                id: stateData.id,
                                name: stateData.name,
                                state_code: stateData.stateCode,
                                latitude: stateData.latitude,
                                longitude: stateData.longitude,
                            });
                        }
                    }

                    await batch.commit();
                }
            }
        }
    }
}).catch((err) => {
    console.error(err);
});
