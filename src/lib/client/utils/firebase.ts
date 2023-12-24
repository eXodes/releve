import { dev } from "$app/environment";

import { firebaseConfig, firebaseEmulator } from "$client/config/firebase";

import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const setAuthPersistence = async () => {
    await setPersistence(auth, inMemoryPersistence);
};

setAuthPersistence();

if (dev || firebaseEmulator) connectAuthEmulator(auth, "http://localhost:9099");

export { app, auth };
