# Bad Review (anti-model)

Scenario: the same PR as `good-review.md` (order validation endpoint + tests + SDD spec).

## Review output (transcribed)

> - line 3: you should use single quotes here
> - line 7: blank line missing
> - line 12: rename `check` → `validate` sounds better
> - line 15: this variable name is too long
> - line 19: I would have written this as a one-liner
> - line 22: why is this a function and not a class??
> - line 33: this test name could be nicer
> - line 41: formatting
> - line 44: I prefer the other style
> - overall: looks ok, ship it

**Verdict:** "looks ok, ship it"

## Why this review is bad

1. **No blocker coverage.** The review never checked for secrets, PII, accidental files, or whether the SDD spec exists. Had the diff leaked a supplier API key or skipped the workflow spec, this review would have shipped it.
2. **Verdict contradicts the body.** The verdict says "ship it" but the author is left with a wall of nits; no severity mapping, no clear action.
3. **Style nits drown the signal.** Every comment is about formatting/preference that tooling (ruff, eslint, prettier) already enforces — none of it changes behavior. There is a genuinely important should-fix (the implementation-coupled test) that is not mentioned at all.
4. **Not actionable.** "why is this a function and not a class??" is a question with no context, no impact, and no suggestion.
5. **No praise.** Nothing tells the author what the codebase considers *good* (centralized API, no microservices, SDD spec present, idempotency tested).

## Takeaway

The bad review spent all its energy on trivia and missed the findings that actually protect the project. Review by the checklist, classify by severity, and end with a verdict that matches the findings.