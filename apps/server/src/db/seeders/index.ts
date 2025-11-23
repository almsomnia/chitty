import { db } from "@/db"
import { seed } from "drizzle-seed"
import schema from "../schema"

const { priorityEnum, statusTypeEnum, ..._schema } = schema

async function main() {
   await seed(db, _schema).refine((f) => {
      return {
         count: 0,
         users: {
            columns: {
               password: f.default({
                  defaultValue: Bun.password.hashSync("password", {
                     algorithm: "bcrypt",
                  }),
               }),
            },
         },
         tasks: {
            count: 0,
            columns: {
               title: f.loremIpsum({ sentencesCount: 4 }),
               description: f.loremIpsum({ sentencesCount: 12 }),
               status_id: f.number({ minValue: 1, maxValue: 5 }),
            },
         },
         statuses: {
            count: 3,
            columns: {
               name: f.valuesFromArray({
                  values: ["OPEN", "IN PROGRESS", "CLOSED"],
                  isUnique: true,
               }),
               order: f.valuesFromArray({
                  values: [1, 2, 3],
                  isUnique: true,
               }),
            },
         },
      }
   })
}

await main()
