import { Collection } from "$module/common/services/collection.service";
import { CounterCollection } from "$module/counter/counter.collection";
import { countryConverter } from "$module/country/country.converter";
import type { CountryEntity } from "$module/country/country.entity";
import type { Country } from "$module/country/country.model";

export const COUNTRY_COLLECTION_NAME = "countries";

export class CountryCollection extends Collection<CountryEntity, Country> {
    private counterCollection: CounterCollection;

    constructor() {
        super(COUNTRY_COLLECTION_NAME, countryConverter);
        this.counterCollection = new CounterCollection(this.collectionName);
    }

    static async create(country: CountryEntity) {
        const countryCollection = new CountryCollection();

        await countryCollection.add(country);

        const snapshot = await countryCollection.withConverter.doc(country.name).get();

        return snapshot.data() as Country;
    }

    static async delete(uid: string): Promise<void> {
        const countryCollection = new CountryCollection();

        await countryCollection.delete(uid);
    }

    static async deleteAll(uids: string[]) {
        const countryCollection = new CountryCollection();

        uids.map(async (uid) => await countryCollection.delete(uid));
    }

    static async getCountries({ orderBy = "name" } = { orderBy: "name" }): Promise<Country[]> {
        const countryCollection = new CountryCollection();

        const snapshot = await countryCollection.withConverter.orderBy(orderBy).get();

        return snapshot.docs.map((doc) => doc.data());
    }
}
