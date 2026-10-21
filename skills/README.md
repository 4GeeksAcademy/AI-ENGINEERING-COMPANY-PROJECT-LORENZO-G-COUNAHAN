# `skills` folder

This folder contains **agent skills** (reusable capabilities) that help you work consistently across the monorepo: research, data analysis, code review, scraping, math, and more.

- **Main purpose**: standardize how AI agents assist the team across the cross-functional project milestones.
- **Recommendation**: document each skill you add (when to use it, expected inputs/outputs, examples) and keep a clear subfolder structure so skills are easy to discover.

## Skill catalog

| Skill           | Purpose                                                                                                                                                   | Documentation                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `tdd`           | Test-driven development reference (red → green → refactor): good tests, seams, anti-patterns, and loop rules. Installed from `mattpocock/skills`.         | [SKILL.md](./tdd/SKILL.md)                               |
| `code-review`   | Systematic code review: workflow, checklist, severity levels, good/bad examples, and a diff helper. The home of the refactoring stage that TDD hands off. | [SKILL.md](./code-review/SKILL.md)                       |
| `data-analysis` | Data analysis helpers (metrics, pandas clean scripts).                                                                                                    | [resources](./data-analysis/resources/common_metrics.md) |
| `research`      | Research workflows (placeholders).                                                                                                                        | —                                                        |

> **Where skills live.** Global, project-agnostic skills live in `skills/<skill-name>/`. Domain skills specific to Brasaland live in [`agents/skills/`](../agents/skills/README.md). The `npx skills` installer writes into the local, git-ignored `.agents/skills/` area; a symlink from `.agents/skills/tdd` points to the canonical copy here so discovery keeps working without duplication.

> _Spanish version: [README.es.md](./README.es.md)._
