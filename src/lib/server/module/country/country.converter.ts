import type { CountryEntity } from "$module/country/country.entity";
import { Country } from "$module/country/country.model";
import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";

export const countryConverter: FirestoreConverter<Country> = {
    toFirestore(country) {
        return country;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<CountryEntity>) {
        const data = snapshot.data();

        return new Country(snapshot.id, data);
    },
};
