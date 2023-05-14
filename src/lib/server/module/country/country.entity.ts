import type { FirestoreData } from "$server/type/firestore";

export interface TimezoneEntity {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}

export interface CountryEntity extends FirestoreData {
    name: string;
    iso3: string;
    iso2: string;
    numericCode: string;
    phoneCode: string;
    capital: string;
    currency: string;
    currencyName: string;
    currencySymbol: string;
    tld: string;
    native: string;
    region: string;
    subregion: string;
    timezones: TimezoneEntity[];
    translations: Record<string, string>;
    latitude: string;
    longitude: string;
    emoji: string;
    emojiU: string;
}
