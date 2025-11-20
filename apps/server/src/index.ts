import app from "./app"
import { response } from "./utils/http/response"

const port = import.meta.env.SERVER_PORT ?? 3080

app
   .get("/", () => response("OK"))
   .listen(port)

console.log(
   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
