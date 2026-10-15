---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## Objective (single and measurable)

This skill produces a **red → green test suite on pre-agreed seams** for one feature or bug fix — tests that document verifiable behavior through public interfaces and survive refactors without changing meaning. The loop is complete only when a failing test exists for each behavior, the minimum implementation to pass it exists, and no test is implementation-coupled or tautological.

_Out of scope:_ designing the module or its interfaces (see `codebase-design`), refactoring and hardening (see `code-review`), and environment/tooling setup.

## Inputs (documented)

On every cycle the skill consumes the following. **Required** inputs must exist before writing a test; if one is missing, ask instead of assuming.

| Input | Required | What it is | If missing |
| --- | --- | --- | --- |
| Feature / bug request | ✅ | The capability or behavior to build or fix, in the user's words | Ask the user to state the behavior; do not invent a goal |
| Codebase & public interfaces | ✅ | Existing code and the public API/seams the change touches | Ask for the location; read it before writing tests |
| Agreed seams | ✅ | Public boundaries to test, confirmed with the user before any test | Propose seams and confirm; never write at an unconfirmed seam |
| Test framework & runtime | ✅ | The testing tool/language the project actually uses (e.g. pytest, vitest/jest) | Ask or infer from config; do not assume |
| Glossary / vocabulary | 🟡 | `GLOSSARY.md` if present, to name tests consistently | Skip if absent |
| ADRs in the area | 🟡 | Architecture decisions affecting the changed region | Respect if present |

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage (see the `code-review` skill), not the red → green implementation cycle.

## Acceptance criteria (verifiable Definition of Done)

A cycle is done — and only then repeated or handed off — when every item below is true. Each is a yes/no check:

- [ ] **Red written first, for the right reason.** The test is written before the implementation and fails because the behavior is missing, not because of a syntax or environment error.
- [ ] **Testing through agreed seams.** The test exercises the public interfaces confirmed with the user; it does not reach into internals or side channels.
- [ ] **Behavior-focused.** The test would survive a refactor that preserves behavior; no assert on call counts, internal collaborators, or how the work is done.
- [ ] **Independent expected values.** Assertions use known-good literals, worked examples, or the spec — never values recomputed the way the code computes them.
- [ ] **Minimal implementation.** Enough code to pass the current test and nothing more; no speculative features.
- [ ] **One vertical slice per cycle.** One seam, one test, one minimal implementation; no bulk/horizontal test-first passes.
- [ ] **Suite green.** The full affected suite passes with the change; verified by running it, not assumed.
- [ ] **No refactoring inside the loop.** Cleanup was deferred to the review stage (`code-review`) or explicitly requested by the user.
