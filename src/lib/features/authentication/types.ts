export interface UserSession {
    uid: string;
    email?: string;
    name?: string;
    avatar?: string;
    claims?: {
        [key: string]: unknown;
    };
    verified?: boolean;
}
