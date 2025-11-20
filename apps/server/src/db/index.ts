import { SQL } from "bun"
import { drizzle } from "drizzle-orm/bun-sql"
import dbCredentials from "./credentials"
import schemaProvider from "@/providers/dbSchemaProvider"

const pool = new SQL({
   ...dbCredentials,
})

export const db = drizzle({
   client: pool,
   schema: schemaProvider
})
