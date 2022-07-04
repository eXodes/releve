import type { RequestHandler } from "./__types/verify";
import type { ErrorResponse } from "$types/response";

import { User, UserAvatar } from "$_model/user";
import { UserCollection } from "$_collection/users";
import { Timestamp } from "firebase-admin/firestore";

import { handleError } from "$routes/_errors";

export const get: RequestHandler<void | ErrorResponse> = async ({ url }) => {
    const uid = url.searchParams.get("uid") as string;

    const userData = (await User.whereUid(uid)).data();

    if (!userData) throw new Error("Unable to get user session.");

    try {
        const collection = new UserCollection();
        const userAvatar = new UserAvatar(userData.uid);

        await collection.create({
            uid: userData.uid,
            displayName: userData.displayName,
            email: userData.email,
            emailVerified: userData.emailVerified,
            disabled: userData.disabled,
            avatar: userAvatar.getGravatarUrl(userData.email),
            createdAt: Timestamp.fromDate(new Date(userData.createdAt)),
        });

        return {
            status: 200,
        };
    } catch (error) {
        return handleError(error);
    }
};
