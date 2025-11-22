import schema from "../schema"
import { db } from "../"
import { seed } from "drizzle-seed"

const password = "password"

export async function main() {
   console.log("Seeding users table...")
   await seed(db, schema).refine((f) => {
      return {
         users: {
            columns: {
               password: f.default({
                  defaultValue: Bun.password.hashSync(password, {
                     algorithm: "bcrypt",
                  }),
               }),
               created_at: f.default({
                  defaultValue: new Date(),
               }),
               updated_at: f.default({
                  defaultValue: new Date()
               })
            },
         },
      }
   })
}
