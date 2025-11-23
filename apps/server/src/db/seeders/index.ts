import { db } from "@/db"
import { seed } from "drizzle-seed"
import schema from "../schema"

const { priorityEnum, ..._schema } = schema

async function main() {
   await seed(db, _schema).refine((f) => {
      return {
         users: {
            columns: {
               password: f.default({
                  defaultValue: Bun.password.hashSync("password", {
                     algorithm: "bcrypt"
                  })
               }),
            }
         },
         tasks: {
            columns: {
               title: f.loremIpsum({ sentencesCount: 4 }),
               description: f.loremIpsum({ sentencesCount: 12 }),
               status_id: f.number({ minValue: 1, maxValue: 5 }),
            }
         }
      }
   })
}

await main()
