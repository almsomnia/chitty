import { Elysia, t } from "elysia"
import { wsService } from "./ws.service"

const ws = new Elysia().ws("/ws", {
   body: t.Object({
      type: t.String(),
      data: t.Any(),
   }),
   response: t.Object({
      type: t.String(),
      data: t.Any(),
      time: t.Number(),
   }),
   open(ws) {
      console.log(`[WS] Open: ${ws.id}`)
      const response = {
         type: "connection",
         data: {
            message: "Connected"
         },
         time: Date.now()
      }
      ws.send(response)
   },
   message(ws, message) {
      console.log(`[WS] Message from ${ws.id}:`, message)
      const response = wsService.resolveMessage(message)
      ws.send({
         ...response,
         time: Date.now()
      })
   },
   close(ws) {
      console.log(`[WS] Close: ${ws.id}`)
   },
})

export default ws
