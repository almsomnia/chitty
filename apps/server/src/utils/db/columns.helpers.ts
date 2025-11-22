import * as p from "drizzle-orm/pg-core"

export const timestamp = {
   created_at: p.timestamp().defaultNow().notNull(),
   updated_at: p.timestamp().defaultNow().notNull(),
}
