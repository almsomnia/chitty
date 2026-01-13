import type { ElysiaWS } from "elysia/dist/ws"
import { taskService } from "../tasks/task.service"
import { MessageData, MessageType } from "./ws.dto"

type WSHandler<T extends MessageType> = (
   ws: ElysiaWS,
   data: MessageData[T]
) => Promise<void> | void

export abstract class wsService {
   private static emit(ws: ElysiaWS, type: string, data: any) {
      ws.send({
         type,
         data,
         time: Date.now(),
      })
   }

   private static broadcast(
      ws: ElysiaWS,
      topic: string,
      type: string,
      data: any
   ) {
      ws.publish(topic, {
         type,
         data,
         time: Date.now(),
      })
   }

   private static handlers: { [K in MessageType]?: WSHandler<K> } = {
      ping: (ws) => this.emit(ws, "pong", null),
      "subscribe:task": (ws) => {
         ws.subscribe("task")
         this.emit(ws, "subscribe:task", { message: "Subscribed" })
      },
      "task:update": async (ws, data) => {
         const updatedTask = await taskService.update(data.id, data)
         this.broadcast(ws, "task", "task:updated", updatedTask)
         this.emit(ws, "task:update", {
            message: "Task updated",
            task: updatedTask,
         })
      },
      "task:create": async (ws, data) => {
         const newTask = await taskService.create(data)
         this.broadcast(ws, "task", "task:created", newTask)
         this.emit(ws, "task:create", {
            message: "Task created",
            task: newTask,
         })
      },
      "task:publish-updated": async (ws, data) => {
         this.broadcast(ws, "task", "task:updated", data)
         this.emit(ws, "task:updated", data)
      },
   }

   private static executeHandler<K extends MessageType>(
      key: K,
      ws: ElysiaWS,
      data: any
   ) {
      const handler = this.handlers[key] as WSHandler<K>
      if (handler) return handler(ws, data)
      else this.emit(ws, "error", { message: "Unknown command type" })
   }

   public static async handleMessage(
      ws: ElysiaWS,
      message: { type: MessageType; data: any }
   ) {
      try {
         const type = message.type as MessageType
         await this.executeHandler(type, ws, message.data)
      } catch (error) {
         console.error("Failed to handle WS message", error)
         this.emit(ws, "error", { message: "Failed to handle WS message" })
      }
   }
}
