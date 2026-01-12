import type { ElysiaWS } from "elysia/dist/ws"
import { taskService } from "../tasks/task.service"

type Message<T = any> = {
   type: string
   data: T
}

export abstract class wsService {
   public static async handleMessage(ws: ElysiaWS, message: Message) {
      switch (message.type) {
         case "ping":
            this.sendMessage(ws, { type: "pong", data: null })
            break
         case "subscribe:task":
            ws.subscribe("task")
            this.sendMessage(ws, {
               type: "subscribe:task",
               data: { message: "Subscribed" },
            })
            break
         case "task:update":
            await taskService.update(message.data.id, {
               status_id: message.data.status_id,
               rank: message.data.rank,
            })
            this.sendMessage(ws, {
               type: message.type,
               data: {
                  message: "Task updated"
               }
            })
            break
         default:
            this.sendMessage(ws, message)
            break
      }
   }

   private static sendMessage(ws: ElysiaWS, message: Message) {
      ws.send({
         ...message,
         time: Date.now(),
      })
   }
}
