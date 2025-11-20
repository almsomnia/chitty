import { Elysia } from "elysia"
import { auth } from "@/middleware/auth"
import { HttpError } from "@/utils/http/HttpError"
import { response } from "@/utils/http/response"

const app = new Elysia({
   prefix: "api",
   normalize: true,
})
   .onRequest(auth)
   .error({ HttpError })
   .onError((ctx) => {
      const { error, code } = ctx
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

export default app
