import type { CountryEntity } from "$module/country/country.entity";
import type { StateEntity } from "$module/country/state.entity";

export interface StateData extends StateEntity {
    uid: string;
}

export interface CountryData extends CountryEntity {
    uid: string;
    states?: StateData[];
}
