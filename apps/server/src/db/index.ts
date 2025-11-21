import { SQL } from "bun"
import { drizzle } from "drizzle-orm/bun-sql"
import dbCredentials from "./credentials"
import schema from "./schema"

declare global {
   var dbClient: SQL | undefined
}

const client = globalThis.dbClient || new SQL({ ...dbCredentials })

if (process.env.NODE_ENV !== "production") {
   globalThis.dbClient = client
}

export const db = drizzle({
   client,
   schema
})
