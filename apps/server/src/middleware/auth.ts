import { HttpError } from "@/utils/http/HttpError"
import { db } from "@/db"

export const auth = async (request: Request, jwt: JwtPlugin) => {
   const unauthorized = new HttpError("Unauthorized", 401)

   const token = request.headers.get("Authorization")?.replace("Bearer ", "")
   if (!token) throw unauthorized

   const payload = await jwt.verify(token)
   if (!payload) throw unauthorized

   const userData =
      typeof payload.user === "string" ? JSON.parse(payload.user) : payload.user

   const userExists = await db.query.users.findFirst({
      columns: { id: true },
      where: (u, { eq, and }) =>
         and(eq(u.id, userData.id), eq(u.email, userData.email)),
   })

   if (!userExists) throw unauthorized
}
