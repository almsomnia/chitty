import { db } from "@/db"
import type { CreateUserDto, UpdateUserDto } from "./user.dto"
import { table } from "@/db/tables"
import { HttpError } from "@/utils/http/HttpError"
import { eq } from "drizzle-orm"

type GetArgs = {
   page?: string
   per_page?: string
}

const model = db.query.users

export const userService = {
   get: async (args: GetArgs = {}) => {
      const page = (args.page && Number(args.page)) || undefined
      const perPage = (args.per_page && Number(args.per_page)) || undefined

      const offset = page && perPage ? (page - 1) * perPage : undefined
      const limit = perPage

      const result = await model.findMany({
         limit,
         offset,
         columns: {
            password: false,
         },
      })
      return result
   },

   find: async (id: string | number) => {
      const result = await model.findFirst({
         where: (users, { eq }) => eq(users.id, Number(id)),
         columns: {
            password: false,
         },
      })

      return result
   },

   create: async (body: CreateUserDto) => {
      try {
         const result = await db.insert(table.users).values(body).returning({
            id: table.users.id,
            name: table.users.name,
            email: table.users.email,
         })
         return result
      } catch (e) {
         throw e
      }
   },

   update: async (id: number, body: UpdateUserDto) => {
      try {
         const data = await db
            .select({
               id: table.users.id,
            })
            .from(table.users)
            .where(eq(table.users.id, id))

         if (data.length < 1) {
            throw new HttpError("Data not found", 404)
         }

         const result = await db.update(table.users).set(body).returning({
            id: table.users.id,
            name: table.users.name,
            email: table.users.email,
            created_at: table.users.created_at,
            updated_at: table.users.updated_at,
         })

         return result
      } catch (e) {
         throw e
      }
   },

   delete: async (id: number) => {
      try {
         await db
            .delete(table.users)
            .where(eq(table.users.id, id))

         return true
      } catch (e) {
         throw e
      }
   },
}
