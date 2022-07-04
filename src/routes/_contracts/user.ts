import type { auth } from "firebase-admin";

export interface HasUserData {
    data: () => Partial<auth.UserRecord>;
}
