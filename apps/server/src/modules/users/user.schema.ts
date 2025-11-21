import * as p from "drizzle-orm/pg-core"

export const users = p.pgTable("users", {
   id: p.serial("id").primaryKey(),
   name: p.text("name").notNull(),
   email: p.text("email").unique().notNull(),
   password: p.text("password").notNull(),
   created_at: p
      .timestamp("created_at", { withTimezone: true })
      .$default(() => new Date()),
   updated_at: p
      .timestamp("updated_at", { withTimezone: true })
      .$default(() => new Date()),
})
