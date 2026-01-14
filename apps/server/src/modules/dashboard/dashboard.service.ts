import { db } from "@/db"
import { table } from "@/db/tables"
import { between, getTableColumns, and, eq, lt, ne } from "drizzle-orm"

const taskColumns = getTableColumns(table.tasks)
const statusColumns = getTableColumns(table.statuses)

export const dashboardService = {
   getTaskDueToday: async (userId: number) => {
      const now = new Date()
      const startOfDay = new Date(now)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(now)
      endOfDay.setHours(23, 59, 59, 999)

      const data = await db
         .select({
            ...taskColumns,
            status: statusColumns,
         })
         .from(table.tasks)
         .leftJoin(
            table.statuses,
            eq(statusColumns.id, taskColumns.status_id)
         )
         .where(
            and(
               between(
                  taskColumns.due_date,
                  startOfDay.toISOString(),
                  endOfDay.toISOString()
               ),
               eq(table.tasks.assignee_id, userId),
               ne(table.statuses.type, "CLOSE")
            )
         )

      return data
   },
   getOverdueTask: async (userId: number) => {
      const now = new Date()

      const data = await db
         .select({ ...taskColumns, status: statusColumns })
         .from(table.tasks)
         .leftJoin(
            table.statuses,
            eq(statusColumns.id, taskColumns.status_id)
         )
         .where(
            and(
               lt(taskColumns.due_date, now.toISOString()),
               eq(table.tasks.assignee_id, userId),
               ne(table.statuses.type, "CLOSE")
            )
         )

      return data
   },
}
