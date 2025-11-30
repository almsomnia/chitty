import z from "../zod"

const create = z.object({
   title: z.string(),
   description: z.string().optional(),
   status_id: z.number(),
   assignee_id: z.number().optional(),
   due_date: z.iso.date().optional(),
   priority: z.string().optional()
})

const update = create

export const $taskSchema = {
   create,
   update
}

export type CreateTaskSchema = InferSchema<typeof create>
export type UpdateTaskSchema = InferSchema<typeof update>
