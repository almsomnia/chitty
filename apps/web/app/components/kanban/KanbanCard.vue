<script setup lang="ts">
import Draggable from "vuedraggable"
import { DetailTask } from "#components"

const props = defineProps<{
   status: Model.Status
}>()

const { send } = useWS()

const appStore = useAppStore()

const tasks = ref<Model.Task[]>([])
const page = shallowRef(1)
const hasMoreData = shallowRef(true)

async function fetchTasks(status: Model.Status) {
   const response = await $api<API.Response<API.Paginate<Model.Task[]>>>(
      `/api/tasks`,
      {
         method: "get",
         query: {
            page: page.value,
            status_id: status.id,
         },
      }
   )

   if (response.data.to >= response.data.total) {
      hasMoreData.value = false
   }

   tasks.value.push(...response.data.data)
   page.value++
}

onMounted(async () => {
   await fetchTasks(props.status)
})

const dayjs = useDayjs()
function formatDate(date: string | null) {
   if (!date) return "-"
   return dayjs(date).format("DD/MM/YY")
}

function resolveContainerCardColor(status: Model.Status) {
   switch (status.type) {
      case "IDLE":
         return /* @tw */ "bg-accented/25 border border-default dark:border-0 dark:bg-elevated/25 divide-muted"
      case "ACTIVE":
         return /* @tw */ "bg-info-100/50 dark:bg-info-950/35 divide-info-200 dark:divide-info-900"
      case "CLOSE":
         return /* @tw */ "bg-success-100/50 dark:bg-success-950/35 divide-success-200 dark:divide-success-900"
      default:
         throw new Error("Invalid status type")
   }
}

function resolveDateBadgeColor(date: string | null) {
   if (!date) return "neutral"
   const diff = dayjs(date).diff(dayjs(), "day")
   if (diff < 0) return "error"
   if (diff < 3) return "warning"
   return "neutral"
}

function resolvePriorityBadgeColor(priority: Model.Task["priority"]) {
   if (priority === "LOW") return "neutral"
   if (priority === "MEDIUM") return "warning"
   return "error"
}

async function onDragEnd(event: any) {
   const fromStatusId = Number(event.from.dataset.statusId)
   const toStatusId = Number(event.to.dataset.statusId)
   const taskId = Number(event.item.dataset.taskId)

   if (fromStatusId == toStatusId) return
   if (
      Number.isNaN(fromStatusId)
      || Number.isNaN(toStatusId)
      || Number.isNaN(taskId)
   )
      return

   send(
      JSON.stringify({
         type: "task:update",
         data: {
            id: taskId,
            status_id: toStatusId,
         }
      })
   )
}

function onTaskDetail(task: Model.Task) {
   appStore.showDialog(
      `Task #${task.id}`,
      h(DetailTask, {
         data: task,
      }),
      {
         class: /* @tw */ "w-6xl",
      }
   )
}

function onDueDateBadgeClick(task: Model.Task) {
   alert("hehe")
}
</script>

<template>
   <div class="w-xs shrink-0">
      <UCard
         variant="soft"
         :ui="{
            body: 'sm:p-4 flex flex-col flex-1 min-h-0 -m-1',
            root: [
               resolveContainerCardColor(props.status),
               'max-h-full flex flex-col overflow-hidden',
            ],
         }"
      >
         <div class="mb-2 shrink-0">
            <UBadge
               :label="props.status.name"
               :color="$resolveTaskStatusColor(props.status)"
               icon="lucide:circle"
            />
         </div>
         <Draggable
            v-model="tasks"
            item-key="id"
            group="tasks"
            class="space-y-2 overflow-y-auto overscroll-contain flex-1 scrollbar-thin min-h-0 p-1"
            ghost-class="opacity-40"
            drag-class="cursor-grabbing"
            :data-status-id="props.status.id"
            @end="onDragEnd($event)"
         >
            <template #item="{ element: task }">
               <UCard
                  variant="soft"
                  :data-task-id="task.id"
                  :ui="{
                     root: 'rounded-lg cursor-pointer bg-default dark:bg-elevated',
                     body: 'sm:p-2',
                  }"
                  @click="onTaskDetail(task)"
               >
                  <div class="flex flex-col gap-2 select-none">
                     <p class="text-sm line-clamp-2 font-medium">
                        {{ task.title }}
                     </p>
                     <div class="flex items-center gap-2">
                        <UAvatar
                           :text="task.assignee?.name.charAt(0)"
                           size="xs"
                        />
                        <UBadge
                           :label="formatDate(task.due_date)"
                           icon="lucide:calendar"
                           size="sm"
                           variant="outline"
                           :color="resolveDateBadgeColor(task.due_date)"
                           @click.stop="onDueDateBadgeClick(task)"
                        />
                        <UBadge
                           :label="task.priority"
                           icon="lucide:flag"
                           :color="resolvePriorityBadgeColor(task.priority)"
                           variant="soft"
                           size="sm"
                        />
                     </div>
                  </div>
               </UCard>
            </template>
         </Draggable>
         <div class="mt-2">
            <UButton
               variant="ghost"
               :color="$resolveTaskStatusColor(props.status)"
               icon="lucide:plus"
               block
            >
               Add Task
            </UButton>
         </div>
      </UCard>
   </div>
</template>
