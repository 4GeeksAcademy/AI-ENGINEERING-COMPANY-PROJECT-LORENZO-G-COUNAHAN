# Good Review (model example)

Scenario: PR adds a `POST /orders/validate` endpoint to the centralized FastAPI app that checks that an incoming supplier order meets minimum-stock and freshness rules, plus tests.

## Review output

**Scope:** `services/api/routers/orders.py`, `tests/test_orders_validate.py`, `workflows/order-validation/README.md`

**Verdict: APPROVE** ✅ (one should-fix noted for follow-up)

### Must-fix

_None._

### Should-fix

1. **`tests/test_orders_validate.py:42`** — the test asserts the internal call `order_validator.check(e).to_have_been_called_with(...)`. That is implementation-coupled: it will break on a legitimate refactor that preserves behavior. Prefer asserting through the public response, e.g. `POST /orders/validate` returns `{decision: "reject", reason: "stock_minimum"}` for the same input. See `tdd` skill, "anti-patterns".

### Praise

- Correctly rejects orders below minimum stock **and** freshness rules without mixing currencies — amounts stay in the source currency (COP/USD) with no implicit conversion. 👍
- Follows the centralized API: no new microservice for this.
- Adds an SDD spec at `workflows/order-validation/README.md` with trigger, inputs, outputs, error/recovery, and acceptance criteria — exactly what the project expects for workflow changes.
- Tests cover the happy path and the two rejection paths (stock, freshness) plus a duplicate-event idempotency case.

### Why this review is good

- Leads with the strongest finding (implementation-coupled test) and gives a concrete fix.
- Praises specific, behavior-level strengths tied to project rules (multi-currency, no microservices, SDD spec).
- Clear verdict derived from severity levels; one should-fix noted for follow-up, not blocking.
- No drive-by nits, no style commentary on code the tooling already enforces.
