type Message<T = any> = {
   type: string
   data: T
}

export const wsService = {
   resolveMessage: (message: Message) => {
      switch (message.type) {
         case "ping":
            return { type: "pong", data: null }
         default:
            return message
      }
   }
}
