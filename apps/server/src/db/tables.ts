import schema from "./schema"

export const table = {
   users: schema.users,
   tasks: schema.tasks,
} as const
