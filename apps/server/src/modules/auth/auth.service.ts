import { db } from "@/db"
import type { LoginDto } from "./auth.dto"
import { table } from "@/db/tables"
import { eq } from "drizzle-orm"
import { HttpError } from "@/utils/http/HttpError"

export const authService = {
   login: async (payload: LoginDto, jwt: JwtPlugin) => {
      const _credentialError = new HttpError("Unknown credentials", 401)

      const _users = await db
         .select()
         .from(table.users)
         .where(eq(table.users.email, payload.email))
         .limit(1)

      if (_users.length < 1) {
         throw _credentialError
      }

      const { password, ...user } = _users[0]

      const passwordMatch = await Bun.password.verify(
         payload.password,
         password
      )

      if (!passwordMatch) {
         throw _credentialError
      }

      const token = await jwt.sign({
         user: {
            id: user.id
         },
      })

      return { token, user }
   },
}
