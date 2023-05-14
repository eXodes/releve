import type { StateData } from "$features/countries/types";
import type { HasData } from "$module/common/contract/data";
import type { StateEntity } from "$module/country/state.entity";

export class State implements HasData<StateData> {
    protected stateData: StateData;

    constructor(uid: string, data: StateEntity) {
        this.stateData = {
            uid,
            id: data.id,
            name: data.name,
            stateCode: data.stateCode,
            latitude: data.latitude,
            longitude: data.longitude,
            type: data.type,
        };
    }

    get data() {
        return this.stateData;
    }
}
