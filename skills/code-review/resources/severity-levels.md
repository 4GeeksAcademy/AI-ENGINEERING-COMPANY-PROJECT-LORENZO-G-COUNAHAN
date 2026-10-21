# Severity Levels

A common vocabulary for classifying review findings. The verdict (APPROVE / REQUEST CHANGES / COMMENT) is derived from these: any **must-fix** open finding → REQUEST CHANGES.

## 🔴 Must-fix (blocking)

The change must not merge while this is open.

- **Secrets / credentials** in the diff.
- **PII or sensitive financial data** committed or routed to AI agents.
- **Correctness bug** on a critical path (payments, inventory, orders, currency, data integrity).
- **Broken build / failing tests** for the affected area.
- **Missing SDD spec** for a workflow change, or **missing acceptance criteria** that make the behavior unverifiable.
- **Multi-currency violation** (mixed COP/USD with no approved conversion policy).

_Why it matters:_ merging destroys trust in the branch or data correctness.

## 🟡 Should-fix (recommended)

Open findings don't block the verdict alone but should be addressed before or right after merge.

- Edge case not covered (nullable, empty, boundary value) with a low blast radius.
- Test that is implementation-coupled or tautological (won't survive a legitimate refactor).
- Missing test for new logic on a non-critical path.
- Overlooked error path that degrades gracefully but is noisy.
- Dead code or an unused import/export.

_Why it matters:_ reduces future maintenance cost and review fatigue.

## 🟢 Optional / nit

Preferences, naming opinions, style alternatives that don't change behavior. The author may ignore them.

- Formatting preferences not enforced by tooling.
- Suggesting a clearer name when the current one is technically accurate.
- Micro-refactors that make the code a bit nicer.

_Why it matters:_ keeps reviews focused; too many nits drown the signal.

## 💡 Praise

Positive feedback, stated as specifically as findings.

- A clever-but-simple solution to a hard problem.
- Tests that are genuinely about behavior.
- Good use of the centralized API versus a new microservice.
- Clear commit message / docs.

_Why it matters:_ tells the author what "good" means in this codebase and reinforces it.

## Verdict mapping

| Open findings                    | Verdict                                                 |
| -------------------------------- | ------------------------------------------------------- |
| None (or only praise)            | **APPROVE**                                             |
| Only 🟢 / optional               | **COMMENT**                                             |
| Any 🔴 must-fix                  | **REQUEST CHANGES**                                     |
| 🟡 should-fix stack, no blocking | **COMMENT** with explicit "should address before merge" |
