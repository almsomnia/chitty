import type { PreContext } from "elysia"
import { HttpError } from "@/utils/http/HttpError"

export const auth = async (ctx: PreContext) => {
   const { request } = ctx

   const bearer = request.headers.get("Authorization")
   if (!bearer) {
      throw new HttpError("Unauthorized", 401)
   }
   const token = bearer.replaceAll("Bearer ", "")

   if (!token) {
      throw new HttpError("Unauthorized", 401)
   }
}
