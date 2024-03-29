import { handleApiError } from "$server/utils/error";
import { AuthService } from "$module/auth/auth.service";
import { VerificationEmail } from "$module/auth/actions/email";
import { UserCollection } from "$module/user/user.collection";
import { UserAvatar } from "$module/user/user-avatar.model";

import type { MessageResponse } from "$client/types/response";

import type { Actions } from "./$types";

export const actions: Actions = {
    "resend-verification": async ({ request }) => {
        const formData = await request.formData();

        const uid = formData.get("uid") as string;

        if (!uid) {
            throw handleApiError(new Error("User ID is required."));
        }

        const auth = await AuthService.whereUid(uid);

        await auth.sendEmail(new VerificationEmail(auth));

        return {
            message: "Email verification resent.",
        } satisfies MessageResponse;
    },
    "verify": async ({ request }) => {
        const formData = await request.formData();

        const uid = formData.get("uid") as string;
        const email = formData.get("email") as string;

        let user;

        switch (true) {
            case !!uid:
                user = await AuthService.whereUid(uid);
                break;
            case !!email:
                user = await AuthService.whereEmail(email);
                break;
            default:
                throw handleApiError(new Error("User ID or email is required."));
        }

        await UserCollection.create({
            uid: user.data.uid,
            displayName: user.data.displayName,
            email: user.data.email,
            emailVerified: user.data.emailVerified,
            disabled: user.data.disabled,
            avatar: await UserAvatar.getGravatarUrl(uid),
            createdAt: user.data.createdAt,
            customClaims: {
                isAdmin: user.isAdmin,
            },
        });

        return {
            message: "Account verified.",
        } satisfies MessageResponse;
    },
};
