import * as userSchema from "@/modules/users/user.schema"
import * as taskSchema from "@/modules/tasks/task.schema"
import * as statusSchema from "@/modules/statuses/status.schema"

export default {
   ...userSchema,
   ...taskSchema,
   ...statusSchema
}
