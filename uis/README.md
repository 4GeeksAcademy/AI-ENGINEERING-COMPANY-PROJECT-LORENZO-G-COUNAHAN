# `uis` folder

This folder contains **all projects with a user interface** for the cross-functional AI Engineering company project — for example: a public website, admin dashboard frontend, ecommerce UI, customer portals, Streamlit/Gradio app or other frontend-only tools.

## Implemented application — 2026-10-21

[landingpage](./landingpage/README.md) is the public Brasaland website:
Spanish responsive landing, brandbook identity, authorized-by-user local
photographs, `Restaurant` structured data and a Brasa Points registration demo.
The form validates age (18+), contact information, dependent locations and
consent without storing or transmitting data.

From the repository root: `cd uis/landingpage`, `npm ci`, `npm run build`,
then `npm start`. Landing and form share port **3000**; open
`/` or `/application.html` on that server.
See the [plan](./landingpage/Plan.md) and [tasks](./landingpage/tasks.md)
for scope, verification and pending official terms and manual accessibility review.

The template's suggested application areas are:

- **`website`** — the company's public-facing web presence.
- **`backoffice`** — the internal admin application. This is the ideal place to develop multiple solutions within a single project: authentication, people management, operations management, internal communication, and other back-office capabilities.

Organize `uis/` by **different concerns** — each subfolder covers a distinct area of the company (for example, public web vs internal operations) and includes its own technical and functional documentation.

- **Main purpose**: to centralize in a single place all frontend applications that support the company's use cases.
- **Recommendation**: document in this file (or in sub-READMEs) the applications you add, their objective, the technology used, and how to run them.

> _Estas instrucciones también están disponibles en [español](./README.es.md)._
