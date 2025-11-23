import { Elysia, type ValidationError } from "elysia"
import { HttpError } from "@/utils/http/HttpError"
import pluginProvider from "@/providers/pluginProvider"
import userModules from "@/modules/users"
import authModules from "@/modules/auth"
import taskModules from "@/modules/tasks"
import statusModules from "@/modules/statuses"

const port = import.meta.env.SERVER_PORT ?? 3080

const app = new Elysia({
   prefix: "api",
   normalize: true,
})
   .use(pluginProvider)
   .error({ HttpError })
   .onError((ctx) => {
      const { error, code, response } = ctx
      console.error(error)

      switch (code) {
         case "HttpError":
            return response(null, {
               error: error.message,
               code: error.statusCode,
            })
         case "VALIDATION":
            const summary = error.all.map((item) => item.summary).join("; ")

            return response(error.all, {
               error: summary,
               code: 422,
            })
         default:
            return response(null, {
               error:
                  ("message" in error && error.message) ||
                  "Internal server error",
               code: 500,
            })
      }
   })
   .use(authModules)
   .use(userModules)
   .use(taskModules)
   .use(statusModules)
   .get("/", ({ response }) => response(null, { message: "OK" }))
   .listen(port)

console.log(
   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
