# codex-learning-journal

A guided walk through to learn project development with Codex.

## Getting started

1. Install Node.js 18+ / npm 10+.
2. Install dependencies from the repo root: `npm install && npm install --prefix apps/frontend && npm install --prefix apps/backend`.
3. Create `.env` in the repo root with `DATABASE_URL="file:./prisma/dev.db"`.
4. (Optional) add `apps/frontend/.env` with `VITE_API_BASE_URL=http://localhost:4000/api` so the client points at the local API.
5. Apply the initial database schema: `npx prisma migrate dev --schema prisma/schema.prisma`.

## Workspace scripts

Run commands from the repo root to drive both apps:

- `npm run dev` – starts the Express API and Vite frontend via `concurrently`.
- `npm run build` – builds backend TypeScript output then compiles the frontend.
- `npm run test` – runs backend Vitest (with Prisma + Supertest) and the frontend Vitest + React Testing Library suite.

## Per-app commands

- Backend (`apps/backend`)
  - `npm run dev` – reloads the Express server with `ts-node-dev`.
  - `npm run test` – seeds a temporary SQLite DB (`apps/backend/prisma/test.db`), applies migrations, and runs Vitest.
  - `npm run build` – emits compiled files into `apps/backend/dist`.
- Frontend (`apps/frontend`)
  - `npm run dev` – Vite dev server with hot module reload.
  - `npm run test` – Vitest + React Testing Library.
  - `npm run build` – production build into `apps/frontend/dist`.

## Environment variables

Create the root `.env` with `DATABASE_URL="file:./prisma/dev.db"` before running Prisma commands.  
Frontend code should read `import.meta.env.VITE_API_BASE_URL` (e.g., `http://localhost:4000/api`) by defining it in `apps/frontend/.env`.

## Architecture

See `docs/architecture.md` for an overview of the frontend/backed layout, Prisma schema location, and testing strategy.
