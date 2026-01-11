import type { UseWebSocketReturn } from "@vueuse/core"

type WSCallback = {
   onConnected: (ws: WebSocket) => void
   onDisconnected: (ws: WebSocket, event: CloseEvent) => void
   onError: (ws: WebSocket, event: Event) => void
   onMessage: (ws: WebSocket, event: MessageEvent) => void
}

let socketInstance: UseWebSocketReturn<any> | null = null

export default function (cb?: Partial<WSCallback>) {
   if (!socketInstance) {
      const { wsUrl } = useRuntimeConfig().public
      socketInstance = useWebSocket(wsUrl, {
         autoReconnect: true,
         heartbeat: {
            interval: 30000,
            message: JSON.stringify({ type: "ping", data: null }),
            pongTimeout: 10000,
         },
         onConnected: (ws) => {
            console.log("[Kanban WS] Connected")
            cb?.onConnected?.(ws)
         },
         onDisconnected: (ws, event) => {
            console.log("[Kanban WS] Disconnected")
            cb?.onDisconnected?.(ws, event)
            socketInstance = null
         },
         onError: (ws, event) => {
            console.error("[Kanban WS] Error", event)
            cb?.onError?.(ws, event)
         },
         onMessage: (ws, event) => {
            // console.log("[Kanban WS] Message:", event.data)
            cb?.onMessage?.(ws, event)
         },
      })
   }
   return socketInstance
}
