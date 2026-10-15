# Commit Protocol Agent

An instruction-driven agent that enforces the **mandatory pre-commit protocol** for Brasaland. Before every commit, it verifies that the change preserves the functional integrity of the project. It acts as a quality gate: a change that does not pass the protocol must not be committed until fixed.

## Scope

- Inspect every staged and unstaged change before each commit.
- Verify that existing functionality in the affected area is not broken.
- Enforce project rules and the decisions recorded in `memory-bank/`.
- Provide a Conventional Commits message once a change is approved.

## Mandatory protocol (summary)

Every commit must pass, in order:

1. **Inspect** — review `git status`/`git diff` and classify the change by area and criticality.
2. **Integrity & secrets** — reject real secrets, PII, sensitive financial data, build artifacts, and accidental files.
3. **Code quality** — lint/type-check Python and TypeScript changes; validate Markdown links.
4. **Tests** — run the affected suite; require evidence of execution.
5. **Project rules** — multi-currency (COP/USD), no PII in agents, no unjustified microservices, and SDD specs for `workflows/` changes.
6. **Commit message** — Conventional Commits with a single cohesive purpose.
7. **Verdict** — `APPROVED` ✔️ or `REJECTED` ❌ with the list of blockers and fixes.

The full protocol is in [`prompts/system.md`](./prompts/system.md).

## Knowledge sources

- [`CONTEXT.md`](../../CONTEXT.md): Brasaland business, departments, and operating constraints.
- [`memory-bank/projectbrief.md`](../../memory-bank/projectbrief.md): project scope and priorities.
- [`memory-bank/techContext.md`](../../memory-bank/techContext.md): stack, architecture, and technical restrictions.
- [`agents/sdd-workflow-agent/README.md`](../sdd-workflow-agent/README.md): SDD conventions referenced by workflow changes.

## Mechanical enforcement

A standalone `pre-commit` script automates the steps that need no AI: secret scanning, blocking sensitive or artifact files, and checking that workflow changes carry their `workflows/<name>/README.md` specification.

```bash
cp agents/commit-protocol-agent/scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Or point Git directly at the scripts directory:

```bash
git config core.hooksPath agents/commit-protocol-agent/scripts
```

The semantic checks (code quality, tests, project rules, verdict) remain the agent's responsibility during the commit review.

## Safety and project constraints

- Never approve a commit that contains secrets, personal data (PII), sensitive financial information, broken tests, or type errors.
- Never claim a test, lint, or command was executed without an available tool and observable evidence.
- Respect multi-currency (COP/USD), multi-country, no-PII-in-agents, and no-unjustified-microservices rules.
- Editing the user's change requires explicit permission.

## Prompt

See [`prompts/system.md`](./prompts/system.md) for the agent's operating instructions.

## Validation

This is currently a prompt-and-documentation agent plus an optional Git hook; the repository has no agent runtime. Validate the protocol against: a commit with a leaked secret, a commit with failing tests, a workflow change without its specification, and a clean, compliant commit.

> Spanish version: [README.es.md](./README.es.md).