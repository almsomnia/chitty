interface WSMessageData {
   pong: null
   "subscribe:task": { message: string }
   "task:update": { message: string, task: Model.Task }
   "task:create": { message: string, task: Model.Task }
   "task:publish-updated": Model.Task
   "task:updated": Model.Task
   "task:created": Model.Task
}

type WSMessageType = keyof WSMessageData

type WSMessage = {
   [K in keyof WSMessageData]: {
      type: K
      data: WSMessageData[K]
   }
}[keyof WSMessageData]
