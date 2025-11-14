# Repository Guidelines

## Project Structure & Module Organization
The repo currently contains requirements (`codex-learning-journal-PRD.md`), lesson guides, and detailed steps under `docs/`. Source code belongs in `apps/frontend` (React + Vite + Tailwind) and `apps/backend` (Express + Prisma + SQLite); shared schemas stay under `prisma/`. Organize UI files by feature (`src/features/entries`), shareable components (`src/components`), and styles (`src/styles`). Backend modules mirror Express flow: `src/server.ts` boots middleware, `src/routes/entries.ts` owns CRUD, while Prisma and validation helpers live in `src/lib`.

## Build, Test, and Development Commands
Run `npm install` at the repo root to pull shared tooling (`concurrently`). `npm run dev` starts backend and frontend together (it shells into each `apps/*` package), `npm run build` compiles both, and `npm run test` executes the paired Vitest suites. Apply schema edits with `npx prisma migrate dev --name <label>` so `prisma/migrations/` and `prisma/dev.db` remain in sync, and seed test data with `npx prisma db seed` when `prisma/seed.ts` is added.

## Coding Style & Naming Conventions
Use TypeScript, ES modules, and the default two-space indent from Vite/tsconfig. Name React components/hooks/context providers in PascalCase (`EntryForm.tsx`, `useEntriesQuery.ts`); keep utilities lowercase (`date-format.ts`). Backend helpers stay camelCase and route files follow their resource (`entries.ts`). Prefer Tailwind utilities, React Query for data fetching, and small pure functions for business rules. Format with Prettier (or the VS Code default) before committing.

## Testing Guidelines
Backend tests rely on Vitest plus Supertest; mirror each route with a `*.test.ts` that launches an in-memory SQLite DB (`DATABASE_URL="file:./prisma/test.db"` via `cross-env`). Frontend tests use Vitest with React Testing Library and JSDOM, colocated with their components (`EntriesList.test.tsx`). Cover every CRUD path and state transition, and block merges on `npm run test`. Prefer fixtures/factories over handwritten Prisma mocks.

## Commit & Pull Request Guidelines
History already follows Conventional Commits (`docs:`, `chore:`); continue with lowercase types (`feat`, `fix`, `docs`, `test`, `chore`) plus a short imperative summary. PR descriptions should reference the relevant PRD or implementation-plan item, list automated/manual tests, and highlight schema or env-var changes. Attach screenshots for UI updates and enumerate manual steps so reviewers can reproduce them.

## Environment & Configuration
Create a root `.env` with `DATABASE_URL="file:./prisma/dev.db"` before running migrations and keep it untracked. Frontend requests must read `import.meta.env.VITE_API_BASE_URL` (set in `apps/frontend/.env`). Align Express and frontend ports, and record any deviation in `docs/` so future agents can repeat your environment.
