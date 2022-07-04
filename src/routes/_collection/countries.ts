import type { firestore } from "firebase-admin";
import type { CountryData, StateData } from "$_model/country";
import type { ListData } from "$types/collection";

import { Collection } from "$_model/database";

const countryConverter = {
    toFirestore(country: CountryData): firestore.DocumentData {
        return {
            name: country.name,
            phoneCode: country.phoneCode,
            capital: country.capital,
            currency: country.currency,
            currencyName: country.currencyName,
            currencySymbol: country.currencySymbol,
            native: country.native,
            region: country.region,
            subregion: country.subregion,
            timezones: country.timezones,
            emoji: country.emoji,
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): CountryData {
        const data = snapshot.data();

        return {
            name: data.name,
            phoneCode: data.phoneCode,
            capital: data.capital,
            currency: data.currency,
            currencyName: data.currencyName,
            currencySymbol: data.currencySymbol,
            native: data.native,
            region: data.region,
            subregion: data.subregion,
            timezones: data.timezones,
            emoji: data.emoji,
        } as CountryData;
    },
};

export const stateConverter = {
    toFirestore(state: StateData): firestore.DocumentData {
        return {
            id: state.id,
            name: state.name,
            stateCode: state.stateCode,
            latitude: state.latitude,
            longitude: state.longitude,
        };
    },
    fromFirestore(snapshot: firestore.QueryDocumentSnapshot): StateData {
        const data = snapshot.data();

        return {
            id: data.id,
            name: data.name,
            stateCode: data.stateCode,
            latitude: data.latitude,
            longitude: data.longitude,
        } as StateData;
    },
};

export class CountryCollection extends Collection<CountryData> {
    constructor() {
        super("countries", countryConverter);
    }

    getSortedCountries = async (): Promise<ListData[]> => {
        const snapshots = await this.collection.orderBy("name").get();

        if (snapshots.empty) {
            return [];
        }

        return snapshots.docs.map((snapshot) => ({
            label: snapshot.data().name,
            value: snapshot.id,
        }));
    };

    getSortedStates = async (uid: string): Promise<ListData[]> => {
        const snapshots = await this.collection
            .doc(uid)
            .collection("states")
            .withConverter(stateConverter)
            .orderBy("name")
            .get();

        if (snapshots.empty) {
            return [];
        }

        return snapshots.docs.map((snapshot) => ({
            label: snapshot.data().name,
            value: snapshot.id,
        }));
    };
}
