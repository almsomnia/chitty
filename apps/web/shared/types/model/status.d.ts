declare namespace Model {
   type Status = {
      id: number
      name: string
      type: "IDLE" | "ACTIVE" | "CLOSE"
      order: string
   }
}
