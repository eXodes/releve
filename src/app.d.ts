/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    interface Locals {
        user?: import("$_model/user").User;
    }

    // interface Platform {}

    interface Session {
        authenticated: boolean;
        user?: import("$features/authentication/types").UserSession;
    }

    // interface Stuff {}
}
