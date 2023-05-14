declare namespace App {
    interface Locals {
        session?: import("$module/auth/auth.model").Auth;
    }

    // interface PageData {}

    // interface Platform {}

    interface Error {
        status: number;
        code: string;
        message: string;
        stack?: string;
    }
}
