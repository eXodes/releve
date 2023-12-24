# Releve

This is a project that uses SvelteKit as the frontend framework and Firebase as the backend service.

> This project is currently under development.

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`).

Start the Firebase services emulator:

```bash
npm run firebase:emu:backend
```

Then seed the database:

```bash
# required for primary seed data
npm run firebase:seed

# or seed the database with fake data
npm run firebase:seed:faker
```

Finally, start the SvelteKit dev server:

```bash
npm run dev
```

#### URLs

-   Firebase Emulator UI: http://localhost:4000
-   SvelteKit: http://localhost:5173

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
