import { AuthService } from "$module/auth/auth.service";
import type { Observer, Publisher } from "$module/common/contract/observable";
import { UserCollection } from "$module/user/user.collection";
import { User } from "$module/user/user.model";

export class AuthObserver implements Observer {
    async updateSubject(publisher: Publisher): Promise<void> {
        if (publisher instanceof User) {
            const user = await UserCollection.getUserByUid(publisher.data.uid);

            if (!user) {
                return await AuthService.delete(publisher.data.uid);
            }

            await AuthService.updateRecord(publisher);
        }
    }
}
