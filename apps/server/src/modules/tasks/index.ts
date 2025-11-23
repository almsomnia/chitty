import { auth } from "@/middleware/auth"
import pluginProvider from "@/providers/pluginProvider"
import { Elysia, t } from "elysia"
import { taskService } from "./task.service"
import { createTaskDto, updateTaskDto } from "./task.dto"

export default new Elysia({ prefix: "tasks" })
   .use(pluginProvider)
   .guard({
      beforeHandle: ({ request, jwt }) => auth(request, jwt),
   })
   .get(
      "/",
      async ({ response, query }) => {
         const data = await taskService.get({
            page: query.page,
            per_page: query.per_page,
         })
         return response(data)
      },
      {
         query: t.Optional(
            t.Object({
               page: t.Optional(t.Numeric({ minimum: 1 })),
               per_page: t.Optional(t.Numeric({ minimum: 0 })),
            })
         ),
      }
   )
   .get(
      "/:id",
      async ({ response, params }) => {
         const data = await taskService.find(params.id)
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
         const result = await taskService.create(body)
         return response(result, { message: "Task Created", code: 201 })
      },
      {
         body: createTaskDto,
      }
   )
   .put(
      "/:id",
      async ({ response, body, params }) => {
         const result = await taskService.update(params.id, body)
         return response(result, { message: "Task updated" })
      },
      {
         body: updateTaskDto,
         params: t.Object({
            id: t.Numeric(),
         }),
      }
   )
   .delete(
      "/:id",
      async ({ response, params }) => {
         const result = await taskService.delete(params.id)
         return response(result, { message: "Task deleted" })
      },
      {
         params: t.Object({
            id: t.Numeric(),
         }),
      }
   )
