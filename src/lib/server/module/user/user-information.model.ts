import type { UserInformationData } from "$features/users/types";
import type { HasData } from "$module/common/contract/data";
import type { UserInformationEntity } from "$module/user/user-information.entity";

export class UserInformation implements HasData<UserInformationData> {
    protected userInformationData: UserInformationData;

    constructor(data: UserInformationEntity) {
        this.userInformationData = data;
    }

    get data() {
        return this.userInformationData;
    }
}
