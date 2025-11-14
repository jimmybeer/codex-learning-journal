# Architecture Overview

## High-level layout

- `apps/frontend` – Vite + React + TypeScript client. Organize UI by feature (`src/features/entries`) with shared building blocks under `src/components`.
- `apps/backend` – Express + TypeScript API with routes in `src/routes` and Prisma helpers in `src/prismaClient.ts`.
- `prisma/` – shared schema (`schema.prisma`), migrations, and the `dev.db` SQLite database defined by the root `.env`.
- Root `package.json` – orchestrates both packages via `npm run dev|build|test` and houses shared tooling like `concurrently`.

## Data flow

1. Frontend calls `VITE_API_BASE_URL` (defaults to `http://localhost:4000/api`) using React Query hooks (to be implemented) to hit backend REST endpoints.
2. Backend routes under `/api/entries` call Prisma via the shared `PrismaClient` singleton (`apps/backend/src/prismaClient.ts`).
3. Prisma reads the SQLite connection string from the repo-level `.env` (`DATABASE_URL="file:./prisma/dev.db"`). Tests override the URL via `cross-env` to write to `apps/backend/prisma/test.db`.

## Testing strategy

- Backend: Vitest + Supertest. `npm run test --prefix apps/backend` runs migrations against the temp SQLite DB, then executes `src/routes/entries.test.ts`.
- Frontend: Vitest + React Testing Library configured via `vite.config.ts` and `src/setupTests.ts`.
- Repository root `npm run test` runs both suites sequentially to mirror CI expectations.
