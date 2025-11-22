import * as p from "drizzle-orm/pg-core"
import { timestamp } from "@/utils/db/columns.helpers"

export const users = p.pgTable("users", {
   id: p.serial("id").primaryKey(),
   name: p.text("name").notNull(),
   email: p.text("email").unique().notNull(),
   password: p.text("password").notNull(),
   ...timestamp
})
