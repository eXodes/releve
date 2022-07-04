import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, inMemoryPersistence, setPersistence } from "firebase/auth";

import { dev } from "$app/env";
import { firebaseConfig } from "$config/firebase";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const setAuthPersistence = async () => {
    await setPersistence(auth, inMemoryPersistence);
};

setAuthPersistence();

if (dev) connectAuthEmulator(auth, "http://localhost:9099");

export { app, auth };
