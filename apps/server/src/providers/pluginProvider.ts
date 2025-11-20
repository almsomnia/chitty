import { Elysia } from "elysia"
import { db } from "@/db"
import { response } from "@/utils/http/response"

const pluginProvider = new Elysia({ name: "plugins" })
   .decorate("db", db)
   .decorate("response", response)

export default pluginProvider
