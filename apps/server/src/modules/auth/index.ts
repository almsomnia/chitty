import { Elysia } from "elysia"
import pluginProvider from "@/providers/pluginProvider"
import { loginDto } from "./auth.dto"
import { authService } from "./auth.service"

export default new Elysia({ prefix: "auth" }).use(pluginProvider).post(
   "/login",
   async ({ response, body, jwt }) => {
      const result = await authService.login(body, jwt)
      return response(result, { message: "Logged In" })
   },
   {
      body: loginDto,
   }
)
