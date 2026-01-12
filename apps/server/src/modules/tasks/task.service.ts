import { db } from "@/db"
import type { CreateTaskDto, UpdateTaskDto } from "./task.dto"
import { table } from "@/db/tables"
import { HttpError } from "@/utils/http/HttpError"
import { paginate, order } from "@/utils/db/query-builder"
import { eq, ilike, getTableColumns, asc, SQL, and } from "drizzle-orm"

type GetArgs = {
   page?: number
   per_page?: number
   title?: string
   status_id?: number
   priority?: typeof columns.priority | (string & {})
   order_key?: keyof typeof columns | (string & {})
   order_dir?: ("asc" | "desc") | (string & {})
}

const columns = getTableColumns(table.tasks)
const { password, ...userColumns } = getTableColumns(table.users)
const statusColumns = getTableColumns(table.statuses)

export const taskService = {
   get: async (args: GetArgs = {}) => {
      const filters: SQL[] = []

      if (args.title) {
         filters.push(ilike(table.tasks.title, `%${args.title}%`))
      }

      if (args.status_id) {
         filters.push(eq(table.tasks.status_id, args.status_id))
      }

      if (args.priority) {
         filters.push(
            eq(
               table.tasks.priority,
               args.priority as typeof table.tasks.priority
            )
         )
      }

      const query = db
         .select({
            ...columns,
            assignee: userColumns,
            status: statusColumns,
         })
         .from(table.tasks)
         .leftJoin(table.users, eq(table.users.id, table.tasks.assignee_id))
         .leftJoin(table.statuses, eq(table.statuses.id, table.tasks.status_id))
         .where(and(...filters))
         .orderBy(
            args.order_dir && args.order_key
               ? order(table.tasks, args.order_key, args.order_dir)
               : asc(table.tasks.rank),
         )
         .$dynamic()

      const result = await paginate(query, args.page, args.per_page)
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
         .where(eq(columns.id, id))

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
               updated_at: new Date(),
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
