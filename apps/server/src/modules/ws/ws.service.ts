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
            const updatedTask = await taskService.update(message.data.id, {
               status_id: message.data.status_id,
               rank: message.data.rank,
            })
            ws.publish("task", {
               type: "task:updated",
               data: updatedTask,
               time: Date.now(),
            })
            this.sendMessage(ws, {
               type: message.type,
               data: {
                  message: "Task updated"
               }
            })
            break
         case "task:create":
            const newTask = await taskService.create(message.data)
            ws.publish("task", {
               type: "task:created",
               data: newTask,
               time: Date.now(),
            })
            this.sendMessage(ws, {
               type: "task:create",
               data: {
                  message: "Task created",
                  task: newTask,
               },
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
