import * as userSchema from "@/modules/users/user.schema"
import * as taskSchema from "@/modules/tasks/task.schema"

export default {
   ...userSchema,
   ...taskSchema
}
