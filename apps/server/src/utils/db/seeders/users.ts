import { users } from "../schema/users"
import { db } from "../"
import { seed } from "drizzle-seed"

async function main() {
   await seed(db, { users })
}

main()
