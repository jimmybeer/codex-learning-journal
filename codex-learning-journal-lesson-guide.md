
# Lesson Guide: Using Codex to Build the Codex Learning Journal

This guide walks you through using **Codex Web**, **Codex CLI**, and the **Codex IDE extension** to build, test, and deploy the _Codex Learning Journal_ project described in the PRD.  

You are assumed to be an **experienced developer** but **new to AI‑assisted workflows**, so each step explains both **what to do** and **why**.

---

## 0. Prerequisites

Before you start, you SHOULD have:

1. **Accounts & access**
   - A ChatGPT plan that includes **Codex** (Plus, Pro, Business, Edu, or Enterprise).
   - A **GitHub** account.

2. **Local tools**
   - **git** installed.
   - **Node.js** (v18+ recommended) and `npm` or `pnpm`.
   - Your preferred IDE (e.g. **VS Code**).

3. **Codex tools installed**
   - **Codex CLI** (terminal):  
     ```bash
     npm i -g @openai/codex
     # or (macOS)
     brew install --cask codex
     ```
   - **Codex IDE extension**: Install from your IDE’s marketplace (search for “OpenAI Codex Extension”) and sign in with your ChatGPT account. citeturn0search2turn0search3

4. (Optional but recommended) A **GitHub SSH key or PAT** configured so you can push without password prompts.

---

## 1. Create the GitHub repository

**Goal:** Set up a clean Git repository that Codex can work in from CLI, IDE, and Cloud.

### Steps

1. **Create a new repo on GitHub**
   - Go to GitHub → “New repository”.
   - Name: `codex-learning-journal`
   - Visibility: your choice (public or private).
   - Initialize with a `README.md` (you can replace later).

2. **Clone it locally**
   ```bash
   git clone git@github.com:<your-username>/codex-learning-journal.git
   cd codex-learning-journal
   ```

3. **Create a basic project structure**
   - For now, just add the two core docs:
     - `codex-learning-journal-PRD.md` (from this PRD).
     - `LESSON-GUIDE.md` (this guide, optional).

4. **Commit and push**
   ```bash
   git add .
   git commit -m "chore: add PRD and lesson guide"
   git push origin main
   ```

**Why:**  
Codex works best with a clear repository context. Having the PRD in the repo lets Codex read it and align its work with your intent. citeturn0search6turn0search9

---

## 2. Use Codex Web for planning and scaffolding

**Goal:** Use Codex Web (chatgpt.com/codex) as your “architect” and planning partner.

### Steps

1. **Open Codex Web**
   - Go to `chatgpt.com/codex` and sign in.
   - Connect your GitHub account if prompted.

2. **Give Codex the project context**
   - Paste the **Overview** and **Goals** sections from the PRD.
   - Ask something like:
     > “You are Codex helping me implement this PRD for `codex-learning-journal`. Suggest a minimal tech stack and high‑level architecture (frontend, backend, DB) that keeps the project simple but realistic.”

3. **Agree on a stack**
   - For example, you might accept a proposal like:
     - Next.js (React + API routes) with TypeScript.
     - SQLite via Prisma.
   - Once you’re happy, ask:
     > “Given that stack, list concrete steps to scaffold the project, including commands to run and files to create.”

4. **Copy useful plans into the repo**
   - Save Codex’s step list into a file: `docs/implementation-plan.md`.

**Why:**  
Codex Web acts as a high‑bandwidth planning environment. You can iterate on ideas, get multiple options, and only then move to the CLI/IDE for actual code changes. citeturn0search6turn0search11

---

## 3. Initialize the project with Codex CLI

**Goal:** Use Codex CLI in the terminal to scaffold the application in your local repo.

### 3.1 Start Codex CLI in your project

```bash
cd codex-learning-journal
codex
```

- The first time, you’ll be asked to authenticate (browser sign‑in). citeturn0search0turn0search9

### 3.2 Explain the project to Codex CLI

In the Codex CLI **prompt area**, type something like:

> “You are working in a clean repo for a training project called Codex Learning Journal. Please read `codex-learning-journal-PRD.md` and `docs/implementation-plan.md` and then propose a concrete list of tasks to scaffold the project using Next.js with TypeScript and SQLite (via Prisma). Don’t run any commands yet; just print the plan.”

Review the plan. If you’re happy, say:

> “Great. Please apply the first step of your plan and stop. Show me which commands you run and which files you create.”

Codex will then run commands (e.g. `npx create-next-app@latest .`) and modify files, asking for approval if configured that way.

**Tip:**  
- If you want tighter control, configure approvals so Codex always asks before running commands: `/approvals ask-for-approval`. citeturn0search1turn0search7

### 3.3 Create and commit the scaffold

Once Codex finishes scaffolding and tests run locally (e.g. `npm test` or `npm run lint` succeeds):

```bash
git status  # review
git diff    # inspect changes
git add .
git commit -m "feat: scaffold Next.js app with basic structure"
git push origin main
```

**Why:**  
Using Codex CLI here lets you “delegate” mundane setup while still staying in control via git. You treat Codex like a junior dev whose work you always review. citeturn0search0turn0search9

---

## 4. Use a feature branch for core functionality

**Goal:** Practice a GitHub flow with branches and PRs, while letting Codex implement features.

### 4.1 Create a feature branch

```bash
git checkout -b feature/learning-entries-crud
```

### 4.2 Implement data model & API with Codex CLI

Start Codex again in this branch if needed:

```bash
codex
```

Prompt example:

> “We’re on branch `feature/learning-entries-crud`. Please implement the `LearningEntry` data model and REST API as defined in the PRD. Use Prisma with SQLite, including migration, and implement the following endpoints: GET /api/entries, GET /api/entries/:id, POST /api/entries, PUT /api/entries/:id, DELETE /api/entries/:id. After changes, run the tests and show me the output.”

Let Codex:

- Initialize Prisma and SQLite.
- Create the schema for `LearningEntry` (fields as per PRD).
- Implement API handlers.
- Add minimal tests.

You should:

1. Review code changes (`git diff`).  
2. Run tests yourself locally if needed (`npm test`).

Commit when happy:

```bash
git add .
git commit -m "feat: implement LearningEntry model and CRUD API"
git push origin feature/learning-entries-crud
```

**Why:**  
You’re using Codex as an implementation engine, but git as the safety net. You still review everything before it hits main.

---

## 5. Open a Pull Request and use Codex for review

**Goal:** Learn how to use GitHub branches + PRs, with Codex as the reviewer.

### 5.1 Create a PR on GitHub

1. Go to your repo on GitHub.  
2. Click **“Compare & pull request”** for `feature/learning-entries-crud`.  
3. Title: `feat: LearningEntry model and CRUD API`.  
4. In the description, paste a short summary and a link to the relevant PRD section.

### 5.2 Ask Codex to review the PR

There are two main options:

1. **Codex Cloud / Web integrated with GitHub**  
   - If Codex is set up with your GitHub, you can use its **Code Review** capabilities to review PRs directly. citeturn0search5turn0search6
   - Ask Codex (in Web or in the PR comment, if available):
     > “@codex please review this PR for correctness vs the PRD and suggest any improvements, especially around validations and error handling.”

2. **Manual copy‑paste approach** (works even without integration)
   - Copy the PR diff (or key files) into Codex Web.
   - Paste the relevant PRD section.
   - Ask for a structured review (bugs, missing requirements, style issues).

### 5.3 Address review comments with Codex

For each issue Codex finds:

- Either fix it yourself, or
- Ask Codex CLI/IDE to make the change.

Example prompt in Codex CLI or IDE:

> “We need to add basic validation to the POST /api/entries route so that title is required and status defaults to PLANNED if omitted. Please implement this change and update or add tests accordingly.”

Commit and push improvements to the same branch. GitHub updates the PR automatically.

### 5.4 Merge the PR

Once tests pass and you’re happy with the review:

- Click **Merge pull request** (Squash or Merge strategy is up to you).  
- Delete the feature branch on GitHub if you want to keep things tidy.  

Then locally:

```bash
git checkout main
git pull origin main
```

**Why:**  
This mirrors a real‑world workflow: feature branches, PRs, automated + AI review, then merge. You’re practicing how to incorporate Codex into team‑style collaboration.

---

## 6. Build the frontend with the Codex IDE extension

**Goal:** Use Codex inside your IDE to create the UI for the Learning Journal.

### 6.1 Open project in IDE

- Open the repo folder in VS Code (or your IDE).
- Ensure the Codex extension is enabled and signed in. citeturn0search3turn0search13

### 6.2 Create a new feature branch

```bash
git checkout -b feature/frontend-ui
```

### 6.3 Use Codex IDE to build pages

In your IDE:

1. Open the main page file (e.g. `app/page.tsx` for Next.js).  
2. Highlight the portion of code you want Codex to work on, or place the cursor where new code should be generated.  
3. Activate Codex (e.g. via a command palette or context menu) and prompt:

   > “Implement a simple Learning Journal UI with:
   >  - A table listing existing entries (title, status, createdAt),
   >  - A form to add a new entry,
   >  - Buttons or links to edit and delete entries.
   > Use the /api/entries API we already implemented. Keep the styling minimal but clean.”

4. Let Codex insert or modify code.  
5. Run the dev server locally:

   ```bash
   npm run dev
   ```

6. Test the UI manually in the browser and fix any small glitches (with or without Codex).

### 6.4 Commit and create a PR

```bash
git add .
git commit -m "feat: basic frontend UI for Learning Journal"
git push origin feature/frontend-ui
```

Create a PR on GitHub and again ask Codex to review it (via Web or GitHub integration).

**Why:**  
Using the IDE extension lets Codex operate with precise context around the file you’re working in, which is ideal for UI and small refactors.

---

## 7. Add automated tests with Codex

**Goal:** Have at least some automated tests as required by the PRD.

### Steps

1. Create a new branch:

   ```bash
   git checkout -b feature/tests
   ```

2. In Codex CLI or IDE, prompt:

   > “Add a minimal test suite for the LearningEntry API. At least:
   >  - one test that creates an entry and reads it back,
   >  - one test that verifies requests without a title fail.
   > Use the testing framework already configured in the project. Add scripts to package.json so I can run `npm test`.”

3. Run tests locally:

   ```bash
   npm test
   ```

4. Fix any failing tests with Codex’s help.

5. Commit & PR:

   ```bash
   git add .
   git commit -m "test: add basic LearningEntry API tests"
   git push origin feature/tests
   ```

6. Get Codex to review this PR as well and merge when ready.

**Why:**  
Tests are a key part of your “contract” with Codex. They let you safely evolve the code with AI help over time.

---

## 8. Deploy the app (with Codex’s help)

**Goal:** Deploy a minimal version of the app so you’ve completed the full lifecycle.

### High‑level approach

Use a platform that supports Node/Next.js (e.g. Vercel, Render, or Netlify). For example, with Vercel:

1. **Prepare the repo**
   - Ensure the app can start with `npm run dev` / `npm run start`.  
   - Make sure your SQLite DB is either:
     - in the repo and suitable for ephemeral environments, or
     - configured to run migrations on startup.

2. **Ask Codex for deployment advice**

   In Codex Web:
   > “I want to deploy this Next.js + SQLite app from GitHub to Vercel. Here is my package.json and any config files. Please tell me step‑by‑step what to click in Vercel and any changes I should make to support production builds.”

3. **Follow instructions**
   - Connect your GitHub repo to the hosting platform.
   - Let it auto‑detect the framework and build commands.
   - Trigger a deployment.

4. **Smoke test**
   - Open the deployed URL.
   - Go through the CRUD flow manually.

**Why:**  
This gets you comfortable using Codex not just as a local helper but also as a deployment consultant, explaining trade‑offs and platform‑specific details.

---

## 9. Using Codex to debug and resolve issues

Inevitably something will break. That’s a feature, not a bug—debugging with Codex is a skill.

### Pattern for using Codex when something fails

1. **Capture the problem clearly**
   - Error message, stack trace, failing test output, or unexpected behavior.
2. **Give Codex enough context**
   - Paste the error + relevant code.
   - Mention any recent changes or PRs.
3. **Ask for both cause and fix**
   > “Here’s the failing test and error. Please explain what’s going wrong and propose a minimal fix. Then show me the patch.”
4. **Apply fix with Codex CLI/IDE**
   - Let Codex implement the change or implement it yourself using its explanation.
5. **Re‑run tests and redeploy if needed.**

**Why:**  
You’re training yourself to treat Codex as a debugging partner, not just a code generator.

---

## 10. Suggested practice loop

Once the basic app is working, you can iterate:

1. Pick a **small enhancement** (e.g. filter by status, add difficulty badges).  
2. Create a **feature branch**.  
3. Ask Codex (Web/CLI/IDE) to implement it.  
4. Add or update tests.  
5. Create a PR, get Codex review, and merge.  
6. Deploy again.

Repeat until the workflow feels natural.

---

## 11. Checklist: Did you hit the full lifecycle?

Use this checklist to verify you’ve used Codex across the full project lifecycle:

- [ ] Requirements documented in the PRD and used as a reference in prompts.  
- [ ] Repo created on GitHub and cloned locally.  
- [ ] Project scaffolded with Codex CLI.  
- [ ] Core backend and frontend features implemented with Codex (CLI and/or IDE).  
- [ ] Automated tests added with Codex’s help.  
- [ ] Feature branches and PRs used for changes.  
- [ ] Codex used to review PRs and suggest improvements.  
- [ ] App deployed to a hosting platform.  
- [ ] At least one bug/issue debugged with Codex’s help.

If all the boxes are ticked, you’ve successfully run a **Codex‑assisted development cycle** from concept to delivery.
