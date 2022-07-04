import type { RequestHandler } from "./__types";
import type { UserData } from "$_model/user";
import type { Media } from "$_model/storage";
import type { ErrorResponse } from "$types/response";

import { User, UserAvatar } from "$_model/user";
import { ShopCollection } from "$_collection/shops";
import { UserCollection } from "$_collection/users";
import { UserInformationCollection } from "$_collection/user-information";
import { Role } from "$features/users/enum";
import { handleError } from "$routes/_errors";
import { validate } from "$routes/_validations";
import { schema } from "$routes/_validations/users/update-user.schema";
import { getFormData } from "$utils/data";

export interface GetOutput {
    user: UserData;
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ params, locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    if (!userData.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const userCollection = new UserCollection();
        const userInformationCollection = new UserInformationCollection(userCollection);

        const user = await userInformationCollection.get(params.uid);

        return {
            status: 200,
            body: {
                user,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

export type Payload = {
    displayName: string;
    role?: Role;
    about?: string;
    email: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    userPhoto?: File;
};

export interface PatchOutput {
    user: UserData;
}

export const patch: RequestHandler<PatchOutput | ErrorResponse> = async ({
    request,
    locals,
    params,
}) => {
    const userData = locals.user?.data();

    if (!userData?.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const formData = await request.formData();

        const payload = getFormData<Payload>(formData);

        validate(schema, payload);

        const userCollection = new UserCollection();
        const userInformationCollection = new UserInformationCollection(userCollection);
        const shopCollection = new ShopCollection();
        const user = await User.whereUid(params.uid);

        userInformationCollection.attach(user);
        user.attach(shopCollection);

        const userAvatar = new UserAvatar(params.uid);
        let avatar: Media;

        if (payload.userPhoto) {
            await userAvatar.addAvatar(payload.userPhoto);
            avatar = await userAvatar.getAvatarUrl();
        } else {
            avatar = (await userCollection.get(params.uid).then((user) => user.avatar)) as Media;
        }

        await userInformationCollection.set({
            uid: params.uid,
            displayName: payload.displayName,
            about: payload.about,
            email: payload.email,
            avatar: avatar,
            customClaims: {
                isAdmin: payload.role === Role.ADMIN,
            },
            information: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNumber: payload.phoneNumber,
                address: {
                    street: payload.streetAddress,
                    city: payload.city,
                    state: payload.state,
                    postalCode: payload.postalCode,
                    country: payload.country,
                },
            },
        });

        const updatedUser = await userInformationCollection.get(params.uid);

        return {
            status: 200,
            body: {
                user: updatedUser,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};

export type DeleteOutput = {
    message: string;
};

export const del: RequestHandler<DeleteOutput | ErrorResponse> = async ({ params, locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    if (!userData?.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const userCollection = new UserCollection();

        userCollection.attach(user);

        await userCollection.delete(params.uid);

        return {
            status: 200,
            body: {
                message: "User deleted.",
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
