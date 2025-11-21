import { Elysia, InferContext } from "elysia"
import { response } from "@/utils/http/response"
import { jwt } from "@elysiajs/jwt"

const pluginProvider = new Elysia({ name: "plugins" })
   .decorate("response", response)
   .use(jwt({ name: "jwt", secret: process.env.SERVER_SECRET ?? "" }))

export default pluginProvider

export type PluginContext = InferContext<typeof pluginProvider>
