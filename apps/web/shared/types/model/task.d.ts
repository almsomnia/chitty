declare namespace Model {
   type Task = {
      id: number
      title: string
      description: string | null
      status_id: number
      assignee_id: Model.User["id"] | null
      assignee: Model.User | null
      due_date: string | null
      priority: "LOW" | "MEDIUM" | "HIGH"
      created_at: string
      updated_at: string
   }
}
