# `agents` folder

This folder contains the monorepo’s **AI agents** (assistants, internal copilots, support/operations agents, etc.) built as part of the cross-functional AI Engineering milestones.

Each subfolder under `agents/` should represent **one concrete agent** (for example `support-agent`, `onboarding-agent`, `sales-assistant`) with its own documentation: goal, capabilities, knowledge/memory sources, available tools, and how to test it.

- **Main purpose**: centralize reusable agent development for the company in one monorepo.
- **Recommendation**: maintain a catalog of agents here as they are created and link to each agent’s README.

## Agent catalog

| Agent | Purpose | Documentation |
|---|---|---|
| `sdd-workflow-agent` | Turns workflow requests into reviewed specifications, implementation plans, and (when requested) n8n exports using Spec-Driven Development. | [README](./sdd-workflow-agent/README.md) |
| `commit-protocol-agent` | Enforces the mandatory pre-commit protocol (secrets, integrity, code quality, tests, project rules) to preserve project functionality. | [README](./commit-protocol-agent/README.md) |

> _Spanish version: [README.es.md](./README.es.md)._
