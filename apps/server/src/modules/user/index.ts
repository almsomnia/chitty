import { Elysia } from "elysia"
import pluginProvider from "@/providers/pluginProvider"
import { userService } from "./service"

export default new Elysia({ prefix: "users" })
   .use(pluginProvider)
   .get("/", async ({ db, response, query }) => {
      const data = await userService(db).get({
         page: query.page,
         per_page: query.per_page,
      })
      return response(data)
   })
   .get("/:id", async ({ db, response, params }) => {
      const data = await userService(db).find(params.id)
      return response(data)
   })
