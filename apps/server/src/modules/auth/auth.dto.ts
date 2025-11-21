import { t, type Static } from "elysia"

export const loginDto = t.Object({
   email: t.String({ format: "email" }),
   password: t.String({ minLength: 8 }),
})

export type LoginDto = Static<typeof loginDto>
