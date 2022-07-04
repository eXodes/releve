export interface TimezoneData {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}

export interface StateData {
    id: number;
    name: string;
    stateCode: string;
    latitude: string;
    longitude: string;
}

export interface CountryData {
    name: string;
    iso2: string;
    iso3: string;
    numericCode: string;
    phoneCode: string;
    capital: string;
    currency: string;
    currencyName: string;
    currencySymbol: string;
    native: string;
    region: string;
    subregion: string;
    timezones: TimezoneData[];
    emoji: string;
}
