import * as p from "drizzle-orm/pg-core"

export const statusTypeEnum = p.pgEnum("status_type", ["IDLE", "ACTIVE", "CLOSE"])

export const statuses = p.pgTable("statuses", {
   id: p.serial().primaryKey(),
   name: p.varchar().notNull(),
   type: statusTypeEnum().notNull(),
   order: p.varchar(),
})
