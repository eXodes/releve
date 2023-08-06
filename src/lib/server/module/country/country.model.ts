import type { HasData } from "$module/common/contract/data";
import type { CountryEntity } from "$module/country/country.entity";

import type { CountryData } from "$features/countries/types";

export class Country implements HasData<CountryData> {
    protected countryData: CountryData;

    constructor(uid: string, data: CountryEntity) {
        this.countryData = {
            uid,
            ...data,
        };
    }

    get data() {
        return this.countryData;
    }
}
