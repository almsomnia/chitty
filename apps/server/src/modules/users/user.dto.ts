import { t, type Static } from "elysia"
import { spreads } from "@/utils/db/spread"
import { table } from "@/db/tables"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"

const refine = {
   email: t.String({ format: "email" }),
}

export const userDto = spreads({
   insert: createInsertSchema(table.users, refine),
   select: createSelectSchema(table.users, refine),
} as const)

export const createUserDto = t.Object({
   name: userDto.insert.name,
   email: userDto.insert.email,
   password: userDto.insert.password,
})

export type CreateUserDto = Static<typeof createUserDto>

export const updateUserDto = t.Omit(createUserDto, ["password"])

export type UpdateUserDto = Static<typeof updateUserDto>
