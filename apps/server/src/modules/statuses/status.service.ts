import { db } from "@/db"
import { CreateStatusDto, UpdateStatusDto } from "./status.dto"
import { table } from "@/db/tables"
import { HttpError } from "@/utils/http/HttpError"
import { eq, asc, getTableColumns } from "drizzle-orm"

const columns = getTableColumns(table.statuses)

export const statusService = {
   get: async () => {
      const result = await db
         .select(columns)
         .from(table.statuses)
         .orderBy(asc(columns.order))

      return result
   },

   find: async (id: number) => {
      const [result] = await db
         .select(columns)
         .from(table.statuses)
         .where(eq(columns.id, id))

      return result
   },

   create: async (payload: CreateStatusDto) => {
      try {
         const result = await db
            .insert(table.statuses)
            .values(payload)
            .returning(columns)

         return result
      } catch (e) {
         throw e
      }
   },

   update: async (id: number, payload: UpdateStatusDto) => {
      try {
         const data = await db
            .select({ id: columns.id })
            .from(table.statuses)
            .where(eq(columns.id, id))

         if (data.length < 1) {
            throw new HttpError("Data not found", 404)
         }

         const result = await db
            .update(table.statuses)
            .set(payload)
            .where(eq(columns.id, id))
            .returning(columns)

         return result
      } catch (e) {
         throw e
      }
   },

   delete: async (id: number) => {
      try {
         await db.delete(table.statuses).where(eq(columns.id, id))
         return true
      } catch (e) {
         throw e
      }
   },
}
