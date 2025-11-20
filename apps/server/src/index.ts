import { Elysia } from "elysia"
import { auth } from "@/middleware/auth"
import { HttpError } from "@/utils/http/HttpError"
import pluginProvider from "@/providers/pluginProvider"

const port = import.meta.env.SERVER_PORT ?? 3080

const app = new Elysia({
   prefix: "api",
   normalize: true,
})
   .use(pluginProvider)
   .error({ HttpError })
   .onRequest(auth)
   .onError((ctx) => {
      const { error, code, response } = ctx
      console.error(error)

      switch (code) {
         case "HttpError":
            return response(null, {
               error: error.message,
               code: error.statusCode,
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

app.get("/", ({ response }) => response(null, { message: "OK" })).listen(port)

console.log(
   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
