import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import { AuthError } from "$module/common/errors/auth";
import { AuthService } from "$module/auth/auth.service";
import { updateAccountSchema } from "$module/auth/validation/update-account.schema";
import { updatePasswordSchema } from "$module/auth/validation/update-password.schema";
import { UserCollection } from "$module/user/user.collection";
import { UserAvatar } from "$module/user/user-avatar.model";
import { UserInformationCollection } from "$module/user/user-information.collection";
import { UserShopsCollection } from "$module/user/user-shops.collection";
import { ShopCollection } from "$module/shop/shop.collection";

import type {
    UpdateUserPayload,
    UpdateUserResponse,
} from "$features/users/validations/update-user";
import type {
    UpdatePasswordPayload,
    UpdatePasswordResponse,
} from "$features/users/validations/update-password";
import type { UserData } from "$features/users/types";
import type { Media } from "$client/types/media";
import { getFormData } from "$client/utils/data";

import type { Actions, PageServerLoad } from "./$types";

export interface SettingsAccountOutput {
    user: UserData;
}

export const load: PageServerLoad<SettingsAccountOutput> = async ({ locals, depends }) => {
    const session = locals.session;

    if (!session) {
        throw handleApiError(new AuthError("Not authenticated.", 401));
    }

    const user = await UserCollection.getUserByUid(session.data.uid);

    if (!user) {
        throw handleApiError(new Error("User not found."));
    }

    depends("settings");

    try {
        const userInformation = await UserInformationCollection.getUserInformationByUid(
            session.data.uid
        );

        return {
            user: {
                ...user.data,
                information: userInformation?.data,
            },
        } satisfies SettingsAccountOutput;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const actions: Actions = {
    account: async ({ request, locals }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new AuthError("Not authenticated.", 401));
        }

        const formData = await request.formData();

        const payload = getFormData<UpdateUserPayload>(formData);

        const errors = validate(updateAccountSchema, payload);

        if (errors) {
            return handleApiError(errors);
        }

        try {
            let avatar: Media | undefined;
            const userAvatar = new UserAvatar(session.data.uid);

            if (payload.userPhoto?.size) {
                avatar = await userAvatar.addAvatar(payload.userPhoto);
            }

            const user = await UserCollection.update({
                uid: session.data.uid,
                avatar: avatar,
                displayName: payload.displayName,
                about: payload.about,
                email: payload.email,
            });

            const userInformation = await UserInformationCollection.update({
                uid: session.data.uid,
                firstName: payload.firstName,
                lastName: payload.lastName,
                address: {
                    street: payload.streetAddress,
                    city: payload.city,
                    state: payload.state,
                    postalCode: payload.postalCode,
                    country: payload.country,
                },
            });

            user.attachObserver(new AuthService().createObserver());
            user.attachObserver(new ShopCollection().createObserver());
            user.attachObserver(new UserShopsCollection(user.data.uid).createObserver());
            user.notifyObserver();

            return {
                user: {
                    ...user.data,
                    information: userInformation?.data,
                },
            } satisfies UpdateUserResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    password: async ({ request, locals }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new AuthError("Not authenticated.", 401));
        }

        const formData = await request.formData();

        const payload = getFormData<UpdatePasswordPayload>(formData);

        const errors = validate(updatePasswordSchema, payload);

        if (errors) {
            return handleApiError(errors);
        }

        try {
            await AuthService.updatePassword(session.data.uid, payload.password);

            return {
                success: true,
            } satisfies UpdatePasswordResponse;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
