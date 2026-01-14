import z from "../zod"

const create = z.object({
   name: z.string(),
   type: z.enum(["IDLE", "ACTIVE", "CLOSE"]),
   order: z.string().nullish(),
})

const update = create

export const $statusSchema = {
   create,
   update
}

export type CreateStatusSchema = InferSchema<typeof create>
export type UpdateStatusSchema = InferSchema<typeof update>
