import { Elysia, t } from "elysia"
import pluginProvider from "@/providers/pluginProvider"
import { userService } from "./user.service"
import { createUserDto, updateUserDto } from "./user.dto"
import { auth } from "@/middleware/auth"

export default new Elysia({ prefix: "users" })
   .use(pluginProvider)
   .guard({
      beforeHandle: ({ request, jwt }) => auth(request, jwt),
   })
   .get(
      "/",
      async ({ request, response, query, status }) => {
         const data = await userService.get({
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
   .get("/:id", async ({ response, params }) => {
      const data = await userService.find(params.id)
      return response(data)
   })
   .post(
      "/",
      async ({ response, body }) => {
         const result = await userService.create(body)
         return response(result, { message: "User Created", code: 201 })
      },
      {
         body: createUserDto,
      }
   )
   .put(
      "/:id",
      async ({ response, body, params }) => {
         const result = await userService.update(params.id, body)
         return response(result, { message: "User updated" })
      },
      {
         body: updateUserDto,
         params: t.Object({
            id: t.Number(),
         }),
      }
   )
   .delete(
      "/:id",
      async ({ response, params }) => {
         const result = await userService.delete(params.id)
         return response(result, { message: "User deleted" })
      },
      {
         params: t.Object({
            id: t.Number(),
         }),
      }
   )
