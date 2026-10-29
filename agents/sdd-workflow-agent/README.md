# SDD Workflow Agent

An instruction-driven agent for designing Brasaland automations with **Spec-Driven Development (SDD)**: specify the workflow, review its design, implement it, and validate it against explicit acceptance criteria.

## Scope

- Translate a business request into a testable workflow specification before proposing implementation.
- Identify owners, trigger, inputs, outputs, systems, data contracts, dependencies, and unresolved decisions.
- Design the happy path and failure paths, including retries, idempotency, observability, and recovery.
- Produce implementation steps and acceptance tests; produce an n8n export only when the user requests one and the required platform details are known.
- Save approved workflow artifacts under `workflows/<workflow-name>/` and document them using the [workflow conventions](../../workflows/README.md).

## Knowledge sources

- [`CONTEXT.md`](../../CONTEXT.md): Brasaland business, departments, and operating constraints.
- [`memory-bank/projectbrief.md`](../../memory-bank/projectbrief.md): project scope and priorities.
- [`memory-bank/techContext.md`](../../memory-bank/techContext.md): stack, architecture, and technical restrictions.
- [`workflows/README.md`](../../workflows/README.md): required workflow documentation.

Re-read these sources when a workflow request depends on them. The user-provided requirements take precedence when they explicitly change project scope; surface conflicts instead of silently overriding project decisions.

## Outputs

For each proposed workflow, create or update a `workflows/<workflow-name>/README.md` containing:

1. Goal, business owner, users, and out-of-scope behavior.
2. Trigger, schedule, inputs, validation rules, outputs, and systems involved.
3. Ordered steps, branches, data contracts, and state changes.
4. Credential names as placeholders only, never secret values.
5. Idempotency, concurrency, retry/timeout policy, error handling, alerting, and recovery.
6. Privacy/security constraints and data retention assumptions.
7. Acceptance criteria, test cases, deployment steps, and rollback/replay procedure.

Keep the specification platform-neutral until the platform is confirmed. n8n is the project default when the user asks for an implementation format, not permission to deploy or connect external systems.

## Safety and project constraints

- Do not invent missing business rules, credentials, APIs, or data fields. Ask about blockers; label non-blocking assumptions.
- Never include real credentials, tokens, or secrets in prompts, examples, or workflow exports.
- AI agents must not access personal data or sensitive financial information, as specified in [`techContext.md`](../../memory-bank/techContext.md). If a workflow needs such data, keep it in deterministic system-to-system steps and do not send it to an AI model.
- Keep Colombia (COP) and Florida (USD) distinctions explicit wherever money, locale, vendors, or operating rules are involved. Never convert currencies without an approved exchange-rate source and timestamp policy.
- Prefer the centralized FastAPI backend over new microservices. Treat POS, supplier, and external API integrations as unverified until their contracts are documented.
- Do not claim a workflow is tested, imported, or deployed unless that action was actually performed and its result is available.

## Prompt

See [`prompts/system.md`](./prompts/system.md) for the agent's operating instructions.

## Validation

This is currently a prompt-and-documentation agent; the repository has no agent runtime or automated SDD test harness. Review each generated specification against the output checklist above. At minimum, test a complete request, a request missing a critical trigger/input, an integration failure, and a request involving personal or sensitive financial data.

> Spanish version: [README.es.md](./README.es.md).
