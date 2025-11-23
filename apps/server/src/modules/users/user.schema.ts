import * as p from "drizzle-orm/pg-core"
import { timestamp } from "@/utils/db/columns.helpers"

export const users = p.pgTable("users", {
   id: p.serial("id").primaryKey(),
   name: p.varchar("name").notNull(),
   email: p.varchar("email").unique().notNull(),
   password: p.varchar("password").notNull(),
   ...timestamp
})
