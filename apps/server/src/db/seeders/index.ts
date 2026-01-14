import { db } from "@/db"
import { seed } from "drizzle-seed"
import { lexorank } from "@/utils/lexorank"
import schema from "../schema"
import { LexoRank } from "@dalet-oss/lexorank"

const { priorityEnum, statusTypeEnum, ..._schema } = schema

const generateRanks = (count: number) => {
   const firstRank = LexoRank.middle()
   const lastRank = firstRank.genNext().genNext()
   const result = firstRank.multipleBetween(lastRank, count - 2)
   return [
      firstRank.toString(),
      ...result.map((item) => item.toString()),
      lastRank.toString(),
   ]
}

async function main() {
   await seed(db, {
      tasks: _schema.tasks,
      statuses: _schema.statuses
   }).refine((f) => {
      return {
         users: {
            count: 0,
            columns: {
               password: f.default({
                  defaultValue: Bun.password.hashSync("password", {
                     algorithm: "bcrypt",
                  }),
               }),
            },
         },
         tasks: {
            count: 20,
            columns: {
               title: f.loremIpsum({ sentencesCount: 1 }),
               description: f.loremIpsum({ sentencesCount: 12 }),
               status_id: f.number({ minValue: 1, maxValue: 3 }),
               rank: f.valuesFromArray({
                  values: generateRanks(20),
                  isUnique: true,
               }),
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
                  values: generateRanks(3),
                  isUnique: true
               })
            },
         },
      }
   })
}

await main()
