import { auth } from "@/middleware/auth"
import pluginProvider from "@/providers/pluginProvider"
import { Elysia, t } from "elysia"
import { dashboardService } from "./dashboard.service"
import { HttpError } from "@/utils/http/HttpError"

export default new Elysia({ prefix: "dashboard" })
   .use(pluginProvider)
   .guard({
      beforeHandle: ({ request, jwt }) => auth(request, jwt),
   })
   .resolve(async ({ headers, jwt }) => {
      const token = headers["authorization"]?.replace("Bearer ", "")
      const payload = await jwt.verify(token)
      if (!payload) throw new HttpError("Unauthorized", 401)
      const user =
         typeof payload.user === "string" ?
            JSON.parse(payload.user)
         :  payload.user

      return {
         userId: user.id,
      }
   })
   .get("/tasks-due-today", async ({ response, userId }) => {
      const data = await dashboardService.getTaskDueToday(userId)
      return response(data)
   })
   .get("/overdue-tasks", async ({ response, userId }) => {
      const data = await dashboardService.getOverdueTask(userId)
      return response(data)
   })
