import z from "../zod"

const create = z.object({
   title: z.string(),
   description: z.string().nullish(),
   status_id: z.number(),
   assignee_id: z.number().nullish(),
   due_date: z.iso.date().nullish(),
   priority: z.string().nullish()
})

const update = create

export const $taskSchema = {
   create,
   update
}

export type CreateTaskSchema = InferSchema<typeof create>
export type UpdateTaskSchema = InferSchema<typeof update>
