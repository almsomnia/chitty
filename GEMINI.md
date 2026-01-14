# Project: Vura - Task Management

## General Instructions

- Before trying to update or modify any code, always make sure to read it first and understand any logic and patterns used in the code.
- When you generate new code, always follow the existing code style and conventions.
- When you generate new code, always add proper comments and documentation.
- When you generate new code, always add proper error handling.
- Confirm Dangerous Commands: If the intended command is potentially destructive (e.g., rm, mv, sudo, systemctl), you MUST explicitly preface the command proposal with a warning: 'WARNING: POTENTIALLY DESTRUCTIVE ACTION REQUIRED.'
- DO NOT create a git commit unless explicitly asked to do so.
- DO NOT push code to remote repository unless explicitly asked to do so.
- Always use Bun as the default package manager.
- DO NOT build the project unless explicitly asked to do so.
- ALWAYS ASK when you want to run any script from `package.json`.

## Project Structure

- The project is using [Bun](https://bun.sh) for package manager.
- The project is a monorepo consisting of a back-end (`./apps/server`) and a front-end (`./apps/web`).
- All of the code is written in [TypeScript](https://www.typescriptlang.org).
- The back-end uses [Elysia](https://elysiajs.com) with [Drizzle](https://orm.drizzle.team) as ORM and [Postgres](https://www.postgresql.org) as database.
- The back-end uses modular pattern. All the modules stored in `./apps/server/src/modules`.
- The back-end uses [TypeBox](https://github.com/sinclairzx81/typebox) for request and response validation.
- The back-end provides WebSocket server for real-time communication. It uses Elysia WebSocket that is configured in `./apps/server/src/modules/ws`.
- The front-end uses [Nuxt 4](https://nuxt.com) with [NuxtUI](https://ui.nuxt.com) and [TailwindCSS](https://tailwindcss.com).
- The front-end uses [Pinia](https://pinia.vuejs.org) for global state management. All the stores stored in `./apps/web/src/stores`.
- The front-end uses [Zod](https://zod.dev) for form validation. All validation schemas are stored in `./apps/web/shared/utils/validation-schemas`.
- The front-end uses BFF pattern for REST API communication.

## Coding Style

- Respect EditorConfig and Prettier configurations.
- Always use camelCase for variable and function names.
- When you generate Vue.js code, always use PascalCase for component names.
- When you generate Vue.js code, always use kebab-case for route and component's prop names.
- When you write a ternary operator and it's too long, always use the following format:
   ```typescript
   const value = condition
      ? trueValue
      : falseValue
   ```
- When handling nullish values, nullish coalescing operator (??) takes precedence over the logical OR operator (||).
