# Codex Learning Journal – Scaffold Task List

1. **Verify prerequisites**
   - Confirm Node.js ≥ 18 and npm are installed by running `node -v` and `npm -v`.
   - Ensure the repository is already initialized (`git status`) and create/update `.gitignore` using `npx gitignore node` if missing.

2. **Initialize shared workspace**
   - Run `npm init -y` at the repo root to establish the shared `package.json`.
   - Install root-level dev dependency `concurrently` (`npm install -D concurrently`).
   - Create `.env` with `DATABASE_URL="file:./prisma/dev.db"` (keep untracked).

3. **Establish directory layout**
   - Create base folders: `mkdir -p apps/frontend apps/backend prisma docs`.
   - Keep future architecture/docs updates inside `docs/`.

4. **Scaffold the frontend (React + Vite + Tailwind)**
   - Generate the Vite React TypeScript app: `npm create vite@latest apps/frontend -- --template react-ts`.
   - Inside `apps/frontend`, install dependencies (`npm install`).
   - Add Tailwind CSS tooling: `npm install -D tailwindcss postcss autoprefixer` and `npx tailwindcss init -p`.
   - Configure `tailwind.config.cjs` content paths and add Tailwind directives to `src/index.css`.
   - Install React Query (`npm install @tanstack/react-query`) and React Router (`npm install react-router-dom`).
   - Set up `src/components/Layout.tsx`, `src/features/entries/*`, and routing in `src/routes.tsx`.
   - Wrap `src/main.tsx` with React Query provider and Router.

5. **Scaffold the backend (Express + Prisma + TypeScript)**
   - From `apps/backend`, run `npm init -y`.
   - Install runtime deps: `npm install express cors`.
   - Install TypeScript + tooling: `npm install -D ts-node-dev typescript @types/node @types/express @types/cors`.
   - Initialize `tsconfig` via `npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --module commonjs --target es2020`.
   - Create `src/server.ts` with Express app and health check.
   - Add npm scripts: `"dev"`, `"build"`, `"start"` per implementation plan.
   - Install Prisma packages (`npm install prisma @prisma/client`) and run `npx prisma init --datasource-provider sqlite`.
   - Define `prisma/schema.prisma` with the `Entry` model and run `npx prisma migrate dev --name init`.
   - Add `src/prismaClient.ts`, `src/routes/entries.ts`, and hook them into `src/server.ts`.
   - Optionally install Zod (`npm install zod`) for request validation.

6. **Shared tooling & scripts**
   - Populate root `package.json` scripts:
     - `"dev": "concurrently \"npm run dev --prefix apps/backend\" \"npm run dev --prefix apps/frontend\""`
     - `"build": "npm run build --prefix apps/backend && npm run build --prefix apps/frontend"`
     - `"test": "npm run test --prefix apps/backend && npm run test --prefix apps/frontend"`
   - Document environment variables (e.g., `VITE_API_BASE_URL`) in `README.md` or `docs/`.

7. **Testing setup**
   - Backend: install `vitest supertest cross-env` (`npm install -D ...`), configure `vitest.config.ts`, and create `src/routes/entries.test.ts`.
   - Frontend: install `vitest @testing-library/react @testing-library/jest-dom jsdom`, configure `vitest.config.ts`, and add component tests (e.g., `EntriesList.test.tsx`).

8. **Housekeeping**
   - Update `README.md` with setup/run/test instructions.
   - Add any architecture overview to `docs/architecture.md`.
   - Optionally configure Git hooks (`npx husky-init && npm install`).
   - Commit the scaffold with a message like `chore: scaffold project`.
