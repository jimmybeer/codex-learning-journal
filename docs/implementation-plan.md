# Codex Learning Journal v1.0 – Implementation Plan

This plan details the concrete steps to scaffold the project using the recommended stack (React + Vite + Tailwind on the frontend, Node.js + Express + Prisma + SQLite on the backend).

## 1. Repository Initialization

1. Ensure Node.js (>=18) and npm are installed.
2. Create a new git repository (skip if already initialized):
   ```bash
   git init
   ```
3. Initialize a root `package.json` to manage shared scripts:
   ```bash
   npm init -y
   ```
4. Add a `.gitignore` using the official Node template:
   ```bash
   npx gitignore node
   ```

## 2. Directory Layout

Create the base folders for frontend, backend, and shared documentation:
```bash
mkdir -p apps/frontend apps/backend prisma docs
```

## 3. Frontend Scaffold (React + Vite + Tailwind)

1. Generate a Vite React app:
   ```bash
   npm create vite@latest apps/frontend -- --template react-ts
   ```
2. Change into the frontend directory and install dependencies:
   ```bash
   cd apps/frontend
   npm install
   ```
3. Install Tailwind CSS, PostCSS, and Autoprefixer:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
4. Configure Tailwind:
   - Update `tailwind.config.cjs` content paths to include `./index.html` and `./src/**/*.{ts,tsx}`.
   - Add Tailwind directives to `src/index.css`.
5. Scaffold shared UI structure:
   - Create `src/components/Layout.tsx` with a shell layout.
   - Create `src/features/entries` with list, form, and detail placeholders.
6. Add React Query for data fetching:
   ```bash
   npm install @tanstack/react-query
   ```
7. Configure React Query provider in `src/main.tsx`.
8. Add routing with React Router:
   ```bash
   npm install react-router-dom
   ```
9. Create initial routes (`src/routes.tsx`) for list and entry form pages.
10. Return to repo root when done:
    ```bash
    cd ../..
    ```

## 4. Backend Scaffold (Express + Prisma)

1. Create backend project skeleton:
   ```bash
   cd apps/backend
   npm init -y
   npm install express cors
   npm install -D ts-node-dev typescript @types/node @types/express @types/cors
   npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --module commonjs --target es2020
   ```
2. Create `src/server.ts` with a basic Express app exposing health check endpoint.
3. Add scripts to `apps/backend/package.json`:
   - `"dev": "ts-node-dev --respawn src/server.ts"`
   - `"build": "tsc"`
   - `"start": "node dist/server.js"`
4. Install Prisma and set up SQLite:
   ```bash
   npm install prisma @prisma/client
   npx prisma init --datasource-provider sqlite
   ```
5. Define the `prisma/schema.prisma` model:
   ```prisma
   model Entry {
     id        Int      @id @default(autoincrement())
     title     String
     summary   String?
     details   String?
     tags      String[] @default([])
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```
6. Run the initial migration:
   ```bash
   npx prisma migrate dev --name init
   ```
7. Create data access layer:
   - `src/prismaClient.ts` exporting a singleton Prisma client.
   - `src/routes/entries.ts` defining CRUD routes using Prisma.
   - Register routes in `src/server.ts` under `/api/entries`.
8. Add request validation with Zod (optional but recommended):
   ```bash
   npm install zod
   ```
9. Return to repo root:
   ```bash
   cd ../..
   ```

## 5. Shared Tooling & Scripts

1. Add root-level scripts in the top `package.json`:
   ```json
   {
     "scripts": {
       "dev": "concurrently \"npm run dev --prefix apps/backend\" \"npm run dev --prefix apps/frontend\"",
       "build": "npm run build --prefix apps/backend && npm run build --prefix apps/frontend",
       "test": "npm run test --prefix apps/backend && npm run test --prefix apps/frontend"
     },
     "devDependencies": {
       "concurrently": "^8.2.0"
     }
   }
   ```
   Install the helper:
   ```bash
   npm install -D concurrently
   ```
2. Configure environment variables:
   - Create `.env` in repo root with `DATABASE_URL="file:./prisma/dev.db"` for Prisma.
   - Document any frontend env vars (e.g., `VITE_API_BASE_URL`).

## 6. Testing Setup

### Backend
1. Install Vitest and Supertest for API testing:
   ```bash
   cd apps/backend
   npm install -D vitest supertest cross-env
   ```
2. Configure `vitest.config.ts` targeting Node.
3. Add sample test in `src/routes/entries.test.ts` using an in-memory SQLite database (`DATABASE_URL="file:./prisma/test.db"` with `cross-env`).

### Frontend
1. Install Vitest, React Testing Library, and related tooling:
   ```bash
   cd ../frontend
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
2. Configure `vitest.config.ts` for JSDOM environment and add setup file enabling jest-dom matchers.

### Return to Root
```bash
cd ../..
```

## 7. Documentation & Housekeeping

1. Update `README.md` with setup instructions (install deps, run migrations, start dev server).
2. Add `docs/architecture.md` summarizing the stack and component responsibilities.
3. Set up Git hooks (optional):
   ```bash
   npx husky-init && npm install
   ```
4. Commit the scaffold:
   ```bash
   git add .
   git commit -m "chore: scaffold project"
   ```

## 8. Next Steps

- Flesh out frontend components for listing, creating, editing, and deleting entries.
- Implement backend validation and error handling.
- Expand test coverage (component tests, API integration, E2E smoke test).
- Consider seeding sample data via `prisma/seed.ts`.
