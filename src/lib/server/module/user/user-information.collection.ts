import { Collection } from "$module/common/services/collection.service";
import { USER_COLLECTION_NAME } from "$module/user/user.collection";
import type { UserInformationEntity } from "$module/user/user-information.entity";
import type { UserInformation } from "$module/user/user-information.model";
import { userInformationConverter } from "$module/user/user-information.converter";
import type { UpdateUserInformationDto } from "$module/user/dto/update-user-information.dto";

export const USER_INFO_COLLECTION_NAME = "details";

export class UserInformationCollection extends Collection<UserInformationEntity, UserInformation> {
    private documentName = "information";

    constructor(protected uid: string) {
        super(
            `${USER_COLLECTION_NAME}/${uid}/${USER_INFO_COLLECTION_NAME}`,
            userInformationConverter
        );
    }

    async getInformation() {
        const snapshot = await this.withConverter.doc(this.documentName).get();

        return snapshot.data();
    }

    static async getUserInformationByUid(uid: string): Promise<UserInformation | undefined> {
        const userInformationSubcollection = new UserInformationCollection(uid);

        return userInformationSubcollection.getInformation();
    }

    static async update(userInformation: UpdateUserInformationDto) {
        const userInformationSubcollection = new UserInformationCollection(userInformation.uid);

        await userInformationSubcollection.set({
            ...userInformation,
            uid: userInformationSubcollection.documentName,
        });

        return await userInformationSubcollection.getInformation();
    }
}
