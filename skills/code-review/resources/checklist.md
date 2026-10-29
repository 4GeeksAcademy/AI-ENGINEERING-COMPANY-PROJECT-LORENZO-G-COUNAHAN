# Code Review Checklist

Apply this checklist to every review, in order. Classify each finding with the severity levels reference. The blocker section comes first on purpose: fix those before any line-by-line discussion.

## 1. Blockers — must fix before merging

- [ ] **Secrets & credentials.** No real `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD`, connection strings with credentials, `.env`, private keys, or certificates in the diff. Values must be placeholders (`${NAME}`) referencing config.
- [ ] **Sensitive data.** No PII, personal employee data, or sensitive financial information committed or routed to AI agents. See `memory-bank/techContext.md`.
- [ ] **Accidental files.** No build artifacts (`node_modules/`, `.venv/`, `__pycache__/`, `dist/`, `.next/`), caches, or scratch files. No unrelated formatting churn in files the change doesn't logically touch.
- [ ] **Fixed the reported problem.** The change actually addresses the stated issue; the acceptance criteria (if defined) are satisfiable.

## 2. Correctness

- [ ] Behavior matches the spec / issue description (read the linked SDD spec or PR description).
- [ ] Edge cases handled: empty input, missing data, boundary values, duplicates, concurrency.
- [ ] Idempotency and retries for anything with external effects (orders, payments, messages, inventory).
- [ ] Error paths: what happens on dependency failure, timeout, partial failure. Is there recovery?
- [ ] No dead code, no silent swallowing of exceptions without a reason.

## 3. Safety & alignment with project rules

- [ ] Multi-currency (COP/USD): no amount mixing, no unapproved conversions, exchange-rate source and timestamp policy respected.
- [ ] No unjustified microservices; new backend code goes to the centralized FastAPI app.
- [ ] No PII routed through AI agents; sensitive data stays in deterministic system-to-system steps.
- [ ] Workflow changes carry their SDD spec (`workflows/<name>/README.md`) with trigger, inputs, outputs, error/recovery, acceptance criteria.

## 4. Design & interfaces

- [ ] Public interfaces are coherent and minimal; seam boundaries respected (see the `tdd` skill).
- [ ] Changes are made at the right layer (no business logic in views/UI, no UI concerns in models).
- [ ] Names are accurate; the code reads like a specification of what it does.
- [ ] No speculative generality (YAGNI); no over-engineering.
- [ ] Dependencies justified; nothing added that could come from the standard library / existing shared packages.

## 5. Quality gates (if the tooling exists)

- [ ] Python: `ruff` clean; types check (mypy/pyright) with no new errors.
- [ ] TypeScript: `tsc --noEmit` clean; ESLint has no new blocking errors.
- [ ] Markdown: relative links point to existing files.
- [ ] Tests: suite passes for the affected area; new logic has tests; tests assert behavior, not implementation (no tautological or implementation-coupled tests).

## 6. Tests

- [ ] Tests actually run and pass (evidence, not assumption).
- [ ] Tests use public interfaces (seams), not internals.
- [ ] Expected values come from an independent source of truth (known-good literal, spec) — not recomputed the way the code computes them.
- [ ] Vertical-slice style: tests reflect one behavior each, not bulk "horizontal slicing".

## 7. Commit & doc hygiene

- [ ] Conventional Commits message matches the change (`feat`, `fix`, `docs`, ...); single cohesive purpose.
- [ ] Documentation updated where the change affects behavior, configuration, or workflows.
- [ ] `memory-bank/` reflects any scope or architecture change.
