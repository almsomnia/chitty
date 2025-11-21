import { defineConfig } from "drizzle-kit"
import dbCredentials from "@/db/credentials"

export default defineConfig({
   schema: "./src/modules/**/*.schema.ts",
   out: "./drizzle",
   dialect: "postgresql",
   dbCredentials: {
      ...dbCredentials,
      ssl: false
   },
})
