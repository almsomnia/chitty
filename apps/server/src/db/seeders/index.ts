import { main as userSeeder } from "./users"
import { db } from "@/db"
import { reset } from "drizzle-seed"
import schema from "../schema"

async function seed() {
   try {
      console.info("Seeding...")
      await Promise.all([userSeeder()])
         .then(() => {
            console.info("Seeding completed")
         })
   } catch (e) {
      reset(db, schema)
      console.info("Seeding failed")
      throw e
   }
}

await seed()
