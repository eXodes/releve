import type { StateEntity } from "$module/country/state.entity";
import { State } from "$module/country/state.model";
import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";

export const stateConverter: FirestoreConverter<State> = {
    toFirestore(country) {
        return country;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<StateEntity>) {
        const data = snapshot.data();

        return new State(snapshot.id, data);
    },
};
