import { env } from "$env/dynamic/public";

export const firebaseEmulator = env.SVELTE_FIREBASE_EMULATOR === "true";

export const firebaseConfig = {
    apiKey: "AIzaSyA3NgA6IkjdZvWucvPW4Kf9HWmQLx0yye8",
    authDomain: "releve-app.firebaseapp.com",
    projectId: "releve-app",
    storageBucket: "releve-app.appspot.com",
    messagingSenderId: "976180097914",
    appId: "1:976180097914:web:ae42bbead6401b6aff5cc3",
    measurementId: "G-F8443GBKHN",
};
