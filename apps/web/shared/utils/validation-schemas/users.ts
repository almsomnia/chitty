import z from "../zod"

const create = z
   .object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(8),
      password_confirmation: z.string(),
   })
   .refine((d) => d.password === d.password_confirmation, {
      error: "Password does not match",
      path: ["password_confirmation"],
   })

const update = create.omit({ password: true, password_confirmation: true })

export const $userSchema = {
   create,
   update
}

export type CreateUserSchema = InferSchema<typeof create>
export type UpdateUserSchema = InferSchema<typeof update>
