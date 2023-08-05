import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";
import type { UserInformationEntity } from "$module/user/user-information.entity";
import { UserInformation } from "$module/user/user-information.model";

export const userInformationConverter: FirestoreConverter<UserInformation> = {
    toFirestore(userInformation) {
        return userInformation;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<UserInformationEntity>) {
        const data = snapshot.data();

        return new UserInformation(data);
    },
};
