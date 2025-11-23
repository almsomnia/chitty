import { db } from "@/db"
import type { CreateTaskDto, UpdateTaskDto } from "./task.dto"
import { table } from "@/db/tables"
import { HttpError } from "@/utils/http/HttpError"
import { paginate } from "@/utils/db/query-builder"
import { eq, getTableColumns } from "drizzle-orm"

type GetArgs = {
   page?: number
   per_page?: number
}

const columns = getTableColumns(table.tasks)
const { password, ...userColumns } = getTableColumns(table.users)

export const taskService = {
   get: async (args: GetArgs = {}) => {
      const count = await db.$count(table.tasks)

      const query = db
         .select({
            ...columns,
            assignee: userColumns,
         })
         .from(table.tasks)
         .leftJoin(table.users, eq(table.users.id, table.tasks.assignee_id))
         .$dynamic()

      const result = await paginate(query, args.page, args.per_page, count)
      return result
   },

   find: async (id: number) => {
      const [result] = await db
         .select({
            ...columns,
            assignee: userColumns,
         })
         .from(table.tasks)
         .leftJoin(table.users, eq(table.users.id, table.tasks.assignee_id))

      return result
   },

   create: async (payload: CreateTaskDto) => {
      try {
         const result = await db
            .insert(table.tasks)
            .values(payload)
            .returning(columns)

         return result
      } catch (e) {
         throw e
      }
   },

   update: async (id: number, payload: UpdateTaskDto) => {
      try {
         const data = await db
            .select({ id: columns.id })
            .from(table.tasks)
            .where(eq(columns.id, id))

         if (data.length < 1) {
            throw new HttpError("Data not found", 404)
         }

         const result = await db
            .update(table.tasks)
            .set({
               ...payload,
               updated_at: new Date()
            })
            .where(eq(columns.id, id))
            .returning(columns)

         return result
      } catch (e) {
         throw e
      }
   },

   delete: async (id: number) => {
      try {
         await db.delete(table.tasks).where(eq(columns.id, id))
         return true
      } catch (e) {
         throw e
      }
   },
}
