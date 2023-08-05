import type { FirestoreConverter, FirestoreQueryDocSnapshot } from "$server/type/firestore";
import type { UserEntity } from "$module/user/user.entity";
import { User } from "$module/user/user.model";

export const userConverter: FirestoreConverter<User> = {
    toFirestore(user) {
        return user;
    },
    fromFirestore(snapshot: FirestoreQueryDocSnapshot<UserEntity>) {
        const data = snapshot.data();

        return new User(snapshot.id, data);
    },
};
