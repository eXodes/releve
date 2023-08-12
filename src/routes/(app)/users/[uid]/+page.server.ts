import { handleApiError } from "$server/utils/error";
import { validate } from "$server/utils/validation";
import { AuthError } from "$module/common/errors/auth";
import { AuthService } from "$module/auth/auth.service";
import { updateAccountSchema } from "$module/auth/validation/update-account.schema";
import { UserCollection } from "$module/user/user.collection";
import { UserAvatar } from "$module/user/user-avatar.model";
import { UserInformationCollection } from "$module/user/user-information.collection";
import { UserShopsCollection } from "$module/user/user-shops.collection";
import { ShopCollection } from "$module/shop/shop.collection";

import type { UpdateUserPayload } from "$features/users/validations/update-user";
import { Role } from "$features/users/enum";
import type { UserData } from "$features/users/types";
import { getFormData } from "$client/utils/data";
import type { Media } from "$client/types/media";

import type { Actions, PageServerLoad } from "./$types";

export interface UserOutput {
    user: UserData;
}

export const load: PageServerLoad<UserOutput> = async ({ locals, params }) => {
    const session = locals.session;

    if (!session) {
        throw handleApiError(new AuthError("Not authenticated.", 401));
    }

    if (!session.isAdmin) {
        throw handleApiError(new AuthError("Not authorized.", 403));
    }

    const user = await UserCollection.getUserByUid(params.uid);

    if (!user) {
        throw handleApiError(new Error("User not found."));
    }

    const userInformation = await UserInformationCollection.getUserInformationByUid(params.uid);

    return {
        user: {
            ...user.data,
            information: userInformation?.data,
        },
    };
};

export const actions: Actions = {
    update: async ({ request, locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new AuthError("Not authenticated.", 401));
        }

        if (!session.isAdmin) {
            throw handleApiError(new AuthError("Not authorized.", 403));
        }

        const uid = params.uid;
        const formData = await request.formData();

        const payload = getFormData<UpdateUserPayload>(formData);

        const errors = validate(updateAccountSchema, payload);

        if (errors) {
            return handleApiError(errors);
        }

        let avatar: Media | undefined;
        const userAvatar = new UserAvatar(uid);

        if (payload.userPhoto?.size) {
            avatar = await userAvatar.addAvatar(payload.userPhoto);
        }

        const customClaims = {
            isAdmin: payload.role === Role.ADMIN,
        };

        const user = await UserCollection.update({
            uid,
            avatar: avatar,
            displayName: payload.displayName,
            about: payload.about,
            email: payload.email,
            customClaims: payload.role ? customClaims : undefined,
        });

        const userInformation = await UserInformationCollection.update({
            uid,
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
        };
    },
    delete: async ({ locals, params }) => {
        const session = locals.session;

        if (!session) {
            throw handleApiError(new AuthError("Not authenticated.", 401));
        }

        if (!session.isAdmin) {
            throw handleApiError(new AuthError("Not authorized.", 403));
        }

        try {
            await UserCollection.delete(params.uid);

            return {
                message: "User deleted.",
            };
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
