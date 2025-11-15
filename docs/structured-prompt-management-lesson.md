# Structured Prompt Management & Context Hygiene

## Goal
- Establish repeatable prompt templates and context practices that keep Codex aligned with your team's standards.

## Rationale
- Consistent prompts reduce drift between requests.
- Managing context actively prevents hallucinations and keeps Codex responsive on long sessions.

## Step-by-Step Instructions
1. **Inventory recurring requests.** List the question types and tasks you ask Codex to perform most often (e.g., "summarize pull requests," "scaffold feature tests").
2. **Draft reusable prompt templates.** For each recurring request, write a template that includes objective, constraints, coding standards, and expected output format. Store the templates in a shared location (e.g., `/docs/prompts/`).
3. **Configure workspace instructions.** Populate Codex workspace instructions with the team's conventions (code style, review expectations, domain vocabulary) so you do not repeat them in every prompt.
4. **Practice context trimming.** After each major exchange, prune irrelevant conversation history or open a fresh thread. Keep only the artefacts Codex still needs (active files, specs, failing test output).
5. **Use external scratchpads for large artefacts.** Move long logs or PRDs into documents and link or summarize them instead of pasting the full text repeatedly.
6. **Review and refine templates weekly.** Gather feedback from collaborators on template clarity and update them to reflect new standards or pain points.

## Success Criteria
- Prompt templates cover the majority of your Codex requests.
- Sessions remain coherent without Codex referencing outdated instructions.
- Team members can follow the documented templates without additional coaching.
