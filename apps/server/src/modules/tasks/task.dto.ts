import { t, type Static } from "elysia"
import { spreads } from "@/utils/db/spread"
import { table } from "@/db/tables"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"

export const taskDto = spreads({
   insert: createInsertSchema(table.tasks),
   select: createSelectSchema(table.tasks)
})

export const createTaskDto = t.Object({
   title: taskDto.insert.title,
   description: taskDto.insert.description,
   status_id: taskDto.insert.status_id,
   assignee_id: taskDto.insert.assignee_id,
   due_date: taskDto.insert.due_date,
   priority: taskDto.insert.priority
})

export type CreateTaskDto = Static<typeof createTaskDto>

export const updateTaskDto = t.Composite([
   t.Omit(createTaskDto, ["title"]),
   t.Object({
      title: t.Optional(t.String())
   })
])

export type UpdateTaskDto = Static<typeof updateTaskDto>
