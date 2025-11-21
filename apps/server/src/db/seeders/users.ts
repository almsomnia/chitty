import schema from "../schema"
import { db } from "../"
import { seed } from "drizzle-seed"

async function main() {
   await seed(db, schema.users)
}

main()
