---
name: code-review
description: Code review practices. Use when the user wants to review a pull request, diff, or changeset, wants a systematic review checklist, needs to assess severity of review comments, or mention "code review". Also the designated home for the refactoring stage that the TDD skill hands off to.
---

# Code Review

Code review is the gate that keeps the codebase coherent, correct, and aligned with the project. This skill is the reference that makes reviews systematic instead of ad hoc: what to look for, in what order, how to classify findings by severity, and how to give feedback that gets acted on.

It is the partner of the [TDD skill](../tdd/SKILL.md): TDD drives the red → green loop; refactoring and hardening belong to the review stage, which lives here.

When exploring the codebase, read `GLOSSARY.md` (if it exists), the project brief and tech context (`memory-bank/projectbrief.md`, `memory-bank/techContext.md`), and respect ADRs in the area you are touching.

## What a good review is

- **Behavior-focused.** Reviews judge whether the change does the right thing for users and callers, not stylistic preference.
- **Systematic.** The same checklist applies to every change, so nothing important is skipped when time is short.
- **Actionable.** Every finding states the problem, why it matters, and a concrete suggestion. No drive-by nitpicks without context.
- **Proportionate.** Effort is concentrated on critical paths, data handling, and public interfaces — not on trivia.

## Review workflow

### 1. Understand the change first

1. Run `git diff` / `git diff --stat` or inspect the PR to map the scope and the files touched.
2. Classify the change by area: Python, TypeScript, data, workflows, docs, infrastructure.
3. Identify whether it touches critical functionality: payments, inventory, orders, currency, PII.

### 2. Fast fail on blockers (before line-by-line)

4. **Secrets & sensitive data:** scan for real `API_KEY`/token/`PASSWORD` values, `.env`, private keys, certificates, PII, or sensitive financial data. Any finding is a **must-fix**.
5. **Scope creep:** files changed by accident (formatting churn, unrelated edits, generated artifacts). Flag for reverting.
6. **Breakage:** obvious syntax errors, broken imports, missing files referenced by links or code.

### 3. Evaluate the change against the checklist

Work through [resources/checklist.md](resources/checklist.md) and classify each finding using [resources/severity-levels.md](resources/severity-levels.md).

High-signal areas for Brasaland specifically:

- **Multi-currency / multi-country:** never mix COP and USD amounts or assume conversions without an approved exchange-rate source and timestamp policy.
- **No PII in agents.** AI agents must not receive personal or sensitive financial data; data flows must keep such data in deterministic system-to-system steps.
- **No unjustified microservices.** New backend code goes into the centralized FastAPI app unless there's explicit approval.
- **Workflows** (`workflows/`): every change must carry its SDD specification with trigger, inputs, outputs, error/recovery, and acceptance criteria.
- **Public interfaces & seams:** tests and consumers observe behavior through public APIs; flag implementation-detail coupling.
- **Tests:** does the change add/adjust tests? Are they behavior-focused (see the `tdd` skill) rather than tautological or implementation-coupled?

### 4. Give feedback by severity, then verdict

Assign every finding a severity (from the severity-levels reference) and end with a clear verdict:

- **APPROVE** — no must-fix findings.
- **REQUEST CHANGES** — one or more must-fix findings, or an unresolved open question on critical behavior.
- **COMMENT** — optional or informational findings; the author may proceed.

Feedback style:

- Lead with the strongest finding, then the rest in descending severity.
- Reference concrete locations (`file:line`) and suggest concrete fixes.
- Praise what is good; it is part of the signal.
- Ask questions instead of guessing intent when behavior is unclear.

## Scope limits

- **Refactoring vs. loop:** like the TDD skill states, refactoring is part of the review stage, not the red → green loop. Direct refactoring proposals here, but propose them as review findings unless asked to apply them.
- **No silent approval:** never mark a review APPROVE when a must-fix finding is open. If a tool is unavailable, say so; do not claim checks were run without evidence.
- **No editing without permission:** on a reviewer pass, propose; apply changes only when the user asks.

## References

- [resources/checklist.md](resources/checklist.md) — the ordered review checklist to apply to every change.
- [resources/severity-levels.md](resources/severity-levels.md) — how to classify findings (must-fix / should-fix / optional / praise).
- [examples/good-review.md](examples/good-review.md) — a model review with reasoned findings and a verdict.
- [examples/bad-review.md](examples/bad-review.md) — an example of what a noisy, unactionable review looks like (and why).
- [scripts/review_diff.sh](scripts/review_diff.sh) — helper that summarizes the diff to orient the review.

## Related project resources

- [`agents/commit-protocol-agent`](../../agents/commit-protocol-agent/README.md) — the mandatory pre-commit protocol; its quality gates (lint, types, tests) overlap the review checklist.
- [`memory-bank/techContext.md`](../../memory-bank/techContext.md) — stack, architecture decisions, and technical restrictions.
- [`memory-bank/projectbrief.md`](../../memory-bank/projectbrief.md) — business scope and priorities.
