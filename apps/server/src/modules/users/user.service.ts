import { db } from "@/db"
import type { CreateUserDto, UpdateUserDto } from "./user.dto"
import { table } from "@/db/tables"
import { HttpError } from "@/utils/http/HttpError"
import { and, asc, eq, getTableColumns, ilike, SQL, sql } from "drizzle-orm"
import { paginate } from "@/utils/db/query-builder"

type GetArgs = {
   page?: number
   per_page?: number
}

type OptionFilter = {
   search?: string
}

export const userService = {
   get: async (args: GetArgs = {}) => {
      const { password, ...columns } = getTableColumns(table.users)
      const query = db.select(columns).from(table.users).orderBy(table.users.id).$dynamic()

      const result = await paginate(query, args.page, args.per_page)
      return result
   },

   find: async (id: string | number) => {
      const { password, ...columns } = getTableColumns(table.users)
      const [result] = await db
         .select(columns)
         .from(table.users)
         .where(eq(table.users.id, Number(id)))

      return result
   },

   create: async (payload: CreateUserDto) => {
      try {
         const data = {
            ...payload,
            password: await Bun.password.hash(payload.password, {
               algorithm: "bcrypt",
            }),
         }

         const result = await db.insert(table.users).values(data).returning({
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

         const result = await db
            .update(table.users)
            .set(body)
            .where(eq(table.users.id, id))
            .returning({
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
         await db.delete(table.users).where(eq(table.users.id, id))

         return true
      } catch (e) {
         throw e
      }
   },

   getOptions: async (filter: OptionFilter) => {
      const filters: SQL[] = []

      if (filter.search) {
         filters.push(ilike(table.users.name, `%${filter.search}%`))
      }

      const { id, name, password, ...meta } = getTableColumns(table.users)

      const result = await db
         .select({
            label: name,
            value: id,
            meta: {
               email: meta.email
            }
         })
         .from(table.users)
         .where(and(...filters))
         .orderBy(asc(id))

      return result
   }
}
