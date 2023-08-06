import { Collection } from "$module/common/services/collection.service";
import { COUNTRY_COLLECTION_NAME } from "$module/country/country.collection";
import type { StateEntity } from "$module/country/state.entity";
import type { State } from "$module/country/state.model";
import { stateConverter } from "$module/country/state.converter";

export const STATE_COLLECTION_NAME = "states";

export class StateCollection extends Collection<StateEntity, State> {
    constructor(protected countryName: string) {
        super(`${COUNTRY_COLLECTION_NAME}/${countryName}/${STATE_COLLECTION_NAME}`, stateConverter);
    }

    async getStates() {
        const snapshot = await this.withConverter.get();

        return snapshot.docs.map((doc) => doc.data());
    }

    static async getStateByCountry(countryName: string): Promise<State[] | undefined> {
        const stateSubcollection = new StateCollection(countryName);

        return stateSubcollection.getStates();
    }

    static async create(countryName: string, state: StateEntity) {
        const stateSubcollection = new StateCollection(countryName);

        await stateSubcollection.add(state);
    }
}
