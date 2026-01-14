import { db } from "@/db"
import { table } from "@/db/tables"
import { between, getTableColumns, and, eq, lt } from "drizzle-orm"

const taskColumns = getTableColumns(table.tasks)

export const dashboardService = {
   getTaskDueToday: async (userId: number) => {
      const now = new Date()
      const startOfDay = new Date(now)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(now)
      endOfDay.setHours(23, 59, 59, 999)

      const data = await db
         .select(taskColumns)
         .from(table.tasks)
         .where(
            and(
               between(
                  taskColumns.due_date,
                  startOfDay.toISOString(),
                  endOfDay.toISOString()
               ),
               eq(table.tasks.assignee_id, userId)
            )
         )

      return data
   },
   getOverdueTask: async (userId: number) => {
      const now = new Date()

      const data = await db
         .select(taskColumns)
         .from(table.tasks)
         .where(
            and(
               lt(taskColumns.due_date, now.toISOString()),
               eq(table.tasks.assignee_id, userId)
            )
         )

      return data
   },
}
