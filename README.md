# SarkariPath

SarkariPath contains a **native Android/iOS mobile application**, a Next.js web/admin-preview application, and a Prisma-backed SQLite database for demo content. Both the website and mobile app use the same Next.js API and database.

## Set up and start the backend

From the repository root, install dependencies and configure the local database:

```bash
npm install
Copy-Item .env.example .env
npm run db:migrate -- --name init
npm run db:seed
```

Start the web interface and API:

```bash
npm run dev
```

The web interface and backend run at [http://localhost:3000](http://localhost:3000). The default SQLite database is `prisma/dev.db` and is ignored by Git. `prisma/seed.mjs` inserts or updates clearly identified demo records without duplicating them when run again.

The migrate command runs Prisma's configured seed command when creating a new development database. Re-run `npm run db:seed` any time you want to restore the demo records.

There is no login or account system in this demo; open the app directly to see the seeded sample data.

In the Study tab (mobile) or `/study` (web), choose **Read resource** to expand the sample lesson, practice questions, and answers. All four seeded resources contain readable content stored in SQLite, including the resource marked PRO; that badge is illustrative and does not enforce payment. Downloads and offline reading are not implemented.

After pulling database changes, stop the backend before running `npm run db:migrate` and `npm run db:seed`, then restart it. On Windows, a running backend can lock Prisma's query-engine file during client generation. Do not run `npm run build` while `npm run dev` is running: both write to `.next`.

## Start the mobile app

In a second terminal:

```bash
cd mobile
npm install
npx expo start
```

Scan the Expo QR code with Expo Go, or press `a` to open an Android emulator and `i` for an iOS simulator (iOS simulator builds require macOS). For a local Android emulator, the app uses `http://10.0.2.2:3000` by default to reach the backend running on the host computer; iOS simulator uses `http://localhost:3000`.

To preview the same mobile UI in a local browser, run `npx expo start --web --port 8091` from `mobile`. The root `.env` must set `EXPO_WEB_ORIGIN="http://localhost:8091"` (as shown in `.env.example`); the development API only grants browser access to that exact origin. This CORS allowance is disabled outside development.

### Physical device or deployed backend

A phone cannot use the emulator loopback addresses. Set the backend origin to an address reachable from that device:

1. Copy `mobile/.env.example` to `mobile/.env`.
2. Set `EXPO_PUBLIC_API_URL` to your computer's LAN address (for example `http://192.168.1.20:3000`) or to your deployed HTTPS API origin.
3. Restart Expo after changing the environment file.
4. Ensure the phone and development computer can communicate and that the host firewall permits the backend port.

Use HTTPS for deployed or production backends. `EXPO_PUBLIC_API_URL` is bundled into the client application and must never contain credentials, private API keys, or other secrets.

## Backend endpoints used by mobile

- `GET /api/exams` — reads exam listings from SQLite.
- `GET /api/materials` — reads study resources from SQLite.
- `GET /api/quiz` — reads quiz prompts and choices from SQLite, without returning the answer key.
- `POST /api/quiz/score` — validates all answers, scores them against database records, and returns the score and answer review.

The web pages and mobile app load exam, material, and quiz data from the database-backed endpoints; they do not silently substitute local records when the database/API is unavailable. Database/API failures are returned as explicit errors. Exam and study pages support pull-to-refresh in the mobile app.

## Validation

From the repository root:

```bash
npm run typecheck
npm run lint
npm run build
```

With the backend running against the seeded demo database, run `npm run test:demo` for API integration checks (resource content, quiz scoring, and invalid submissions). Set `DEMO_API_URL` if it is not at `http://localhost:3000`.

For the Expo project:

```bash
cd mobile
npm run typecheck
npx expo install --check
npx expo export --platform android
npx expo export --platform ios
```

## Current product limitations

The exam listings and learning resources are **illustrative demo data stored in a local SQLite database**, not current recruitment information. Confirm dates, eligibility, and notices with the official recruiting body. The seed command refreshes the known demo IDs; it does not delete other records or reset the database.

Neither app has user authentication, durable progress/bookmark storage, production learning content, downloadable/offline resources, payments, premium entitlement enforcement, push notifications, or an operational admin portal. The web `/admin` route is a read-only preview, and the mobile app is not yet configured with production build profiles or store credentials. SQLite is for local demonstrations; choose and configure an appropriate production database, hosting, and backup strategy before launch.
