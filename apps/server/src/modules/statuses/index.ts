import { auth } from "@/middleware/auth"
import pluginProvider from "@/providers/pluginProvider"
import { Elysia, t } from "elysia"
import { statusService } from "./status.service"
import { createStatusDto, updateStatusDto } from "./status.dto"

export default new Elysia({ prefix: "statuses" })
   .use(pluginProvider)
   .guard({
      beforeHandle: ({ request, jwt }) => auth(request, jwt),
   })
   .get("/", async ({ response }) => {
      const data = await statusService.get()
      return response(data)
   })
   .get(
      "/:id",
      async ({ response, params }) => {
         const data = await statusService.find(params.id)
         return response(data)
      },
      {
         params: t.Object({
            id: t.Numeric(),
         }),
      }
   )
   .post(
      "/",
      async ({ response, body }) => {
         const data = await statusService.create(body)
         return response(data, { message: "Status created" })
      },
      {
         body: createStatusDto,
      }
   )
   .put(
      "/:id",
      async ({ response, body, params }) => {
         const data = await statusService.update(params.id, body)
         return response(data, { message: "Status updated" })
      },
      {
         body: updateStatusDto,
         params: t.Object({
            id: t.Numeric(),
         }),
      }
   )
   .delete(
      "/:id",
      async ({ response, params }) => {
         const data = await statusService.delete(params.id)
         return response(data, { message: "Status deleted" })
      },
      {
         params: t.Object({
            id: t.Numeric(),
         }),
      }
   )
