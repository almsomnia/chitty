import * as p from "drizzle-orm/pg-core"
import { timestamp } from "@/utils/db/columns.helpers"
import { users } from "@/modules/users/user.schema"
import { statuses } from "@/modules/statuses/status.schema"

export const priorityEnum = p.pgEnum("priority", ["LOW", "MEDIUM", "HIGH"])

export const tasks = p.pgTable(
   "tasks",
   {
      id: p.serial().primaryKey(),
      title: p.varchar().notNull(),
      description: p.text(),
      status_id: p
         .integer()
         .notNull()
         .references(() => statuses.id, {
            onDelete: "cascade",
            onUpdate: "no action",
         }),
      assignee_id: p
         .integer()
         .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
         }),
      due_date: p.date(),
      priority: priorityEnum().$default(() => "LOW"),
      rank: p.varchar("rank"),
      ...timestamp,
   },
   (table) => [p.index("task_rank_idx").on(table.rank)]
)
