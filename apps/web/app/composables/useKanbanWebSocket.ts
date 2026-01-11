export default function () {
   const { wsUrl } = useRuntimeConfig().public
   const { status, data, send, open, close } = useWebSocket(
      wsUrl,
      {
         autoReconnect: true,
         heartbeat: {
            interval: 30000,
            message: JSON.stringify({ type: "ping", data: null }),
            pongTimeout: 10000,
         },
         onConnected: (ws) => {
            console.log("[WS] Connected")
         },
         onDisconnected: (ws, event) => {
            console.log("[WS] Disconnected")
         },
         onError: (ws, event) => {
            console.error("[WS] Error", event)
         },
         onMessage: (ws, event) => {
            console.log("[WS] Message:", event.data)
         },
      }
   )

   return {
      status,
      data,
      send,
      open,
      close,
   }
}
