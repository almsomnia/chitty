# Project Analysis Summary

## Overview
This project is a modern full-stack application organized as a monorepo using **Bun Workspaces**. It consists of a high-performance backend API (`server`) and a reactive frontend application (`web`). The domain appears to be a **Task Management System**, featuring users, tasks, statuses, and priorities.

## Technology Stack

### Monorepo & Tooling
- **Manager:** Bun Workspaces
- **Package Manager:** Bun
- **Shared Code:** `apps/web/shared` (Types, Zod Schemas)

### Backend (`apps/server`)
- **Runtime:** Bun
- **Framework:** [ElysiaJS](https://elysiajs.com/) (Fast, lightweight, TypeScript-first)
- **Database:** PostgreSQL (implied by `pg-core` usage)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Validation:** TypeBox (Elysia default) & Drizzle-Typebox
- **Authentication:** JWT (`@elysiajs/jwt`)

### Frontend (`apps/web`)
- **Framework:** [Nuxt 4](https://nuxt.com/) (Beta/Latest, running in SPA mode `ssr: false`)
- **UI Library:** [Nuxt UI](https://ui.nuxt.com/) (Tailwind CSS based)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Date Handling:** Day.js
- **API Architecture:** BFF (Backend for Frontend) pattern using Nuxt Server Routes.

## Architecture & Code Structure

### Backend Architecture
The backend is structured **modularly**. Each domain entity (Users, Tasks, Statuses) has its own directory containing:
- `*.schema.ts`: Database definition (Drizzle).
- `*.dto.ts`: Data Transfer Objects / Validation.
- `*.service.ts`: Business logic.
- `index.ts`: Controller/Route definitions.

**Key Entities:**
1.  **Tasks:**
    -   Attributes: Title, Description, Due Date, Priority (Low, Medium, High).
    -   Relationships: Belongs to a Status (`status_id`) and an Assignee (`assignee_id`).
2.  **Users:** (Standard authentication and profile management).
3.  **Statuses:** (Kanban columns or workflow steps).

### Frontend Architecture
The frontend uses **Nuxt 4** with the new `app/` directory structure.
- **BFF Pattern:** The frontend components do not call the Elysia backend directly. Instead:
    1.  UI calls local Nuxt Server Route (e.g., `/api/tasks`).
    2.  Nuxt Server Route (`apps/web/server/api/...`) uses `$serverApi` utility.
    3.  `$serverApi` attaches the Auth Token and forwards the request to the Elysia Backend (`API_URL`).
- **Composables & Utils:** Strong usage of VueUse and custom composables.
- **Components:** Modularized into `app`, `details`, `forms`, `layouts`, etc.

## Key Features (Inferred)
- **Authentication:** Login/Auth flows.
- **Task Management:** CRUD operations for tasks.
- **Kanban Board:** Indicated by `kanban.vue` and `statuses`.
- **Filtering/Sorting:** API supports pagination, filtering by status/priority, and sorting.
