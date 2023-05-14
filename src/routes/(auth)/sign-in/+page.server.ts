import { VerificationEmail } from "$module/auth/actions/email";
import { AuthService } from "$module/auth/auth.service";
import { UserAvatar } from "$module/user/user-avatar.model";
import { UserCollection } from "$module/user/user.collection";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    "resend-verification": async ({ request }) => {
        const formData = await request.formData();

        const uid = formData.get("uid") as string;

        if (!uid) {
            return fail(400, { message: "User ID is required." });
        }

        const user = await AuthService.whereUid(uid);

        await user.sendEmail(new VerificationEmail(user));

        return {
            message: "Email verification resent.",
        };
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
                return fail(400, { message: "User ID or email is required." });
        }

        await UserCollection.create({
            uid: user.data.uid,
            displayName: user.data.displayName,
            email: user.data.email,
            emailVerified: user.data.emailVerified,
            disabled: user.data.disabled,
            avatar: UserAvatar.getGravatarUrl(user.data.email),
            createdAt: user.data.createdAt,
            customClaims: {
                isAdmin: user.isAdmin,
            },
        });

        return {
            message: "Account verified.",
        };
    },
};
