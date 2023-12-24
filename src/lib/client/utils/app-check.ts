import { appCheck } from "$client/utils/firebase";

import { getToken } from "firebase/app-check";

export const getAppCheckToken = async () => {
    let appCheckToken: string | null;

    try {
        const appCheckTokenResponse = await getToken(appCheck, false);

        appCheckToken = appCheckTokenResponse.token;
    } catch {
        appCheckToken = null;
    }

    return appCheckToken;
};
