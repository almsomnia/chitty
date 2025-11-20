import { defineConfig } from "drizzle-kit"
import dbCredentials from "@/utils/db/credentials"

export default defineConfig({
   schema: "./src/utils/db/schema/*",
   out: "./drizzle",
   dialect: "postgresql",
   dbCredentials: {
      ...dbCredentials,
      ssl: false
   },
})
