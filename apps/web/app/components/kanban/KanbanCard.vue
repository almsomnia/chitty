<script setup lang="ts">
import Draggable from "vuedraggable"
import { DetailTask } from "#components"
import { lexorank } from "#shared/utils/lexorank"

const props = defineProps<{
   status: Model.Status
}>()

const { send, data } = useWS()

const appStore = useAppStore()

watch(data, (newValue) => {
   if (!newValue) return
   try {
      const message = JSON.parse(newValue)
      if (
         message.type === "task:create"
         && message.data.task.status_id === props.status.id
      ) {
         tasks.value.push(message.data.task)
         appStore.notify({
            title: message.data.message,
            color: "success",
         })
      }
   } catch (error) {
      console.error("Failed to parse WS message", error)
   }
})

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

async function onChange(event: any) {
   if (event.added) {
      const { element, newIndex } = event.added
      await handleTaskUpdate(element, newIndex)
   }
   if (event.moved) {
      const { element, newIndex } = event.moved
      await handleTaskUpdate(element, newIndex)
   }
}

async function handleTaskUpdate(task: Model.Task, index: number) {
   const prevTask = tasks.value[index - 1]
   const nextTask = tasks.value[index + 1]
   const prevRank = prevTask ? prevTask.rank : null
   const nextRank = nextTask ? nextTask.rank : null

   const newRank = lexorank.getRankBetween(prevRank, nextRank) as string

   task.rank = newRank
   task.status_id = props.status.id

   send(
      JSON.stringify({
         type: "task:update",
         data: {
            id: task.id,
            status_id: props.status.id,
            rank: newRank,
         },
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

const isAddingTask = ref(false)
const newTaskTitle = ref("")
const newTaskInputRef = useTemplateRef("newTaskInputRef")

function startAddingTask() {
   isAddingTask.value = true
   nextTick(() => {
      newTaskInputRef.value?.textareaRef?.focus()
   })
}

function cancelAddingTask() {
   isAddingTask.value = false
   newTaskTitle.value = ""
}

function createTask() {
   if (!newTaskTitle.value.trim()) return

   const lastTask = tasks.value[tasks.value.length - 1]
   const newRank = lexorank.getRankBetween(lastTask?.rank, null) as string

   send(
      JSON.stringify({
         type: "task:create",
         data: {
            title: newTaskTitle.value,
            status_id: props.status.id,
            rank: newRank,
         },
      })
   )

   newTaskTitle.value = ""
   nextTick(() => {
      isAddingTask.value = false
   })
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
            @change="onChange"
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
         <div
            v-if="isAddingTask"
            class="mt-2 p-1"
         >
            <UCard
               variant="soft"
               :ui="{
                  root: 'rounded-lg bg-default dark:bg-elevated ring-1 ring-primary-500/50',
                  body: 'sm:p-2',
               }"
            >
               <UTextarea
                  ref="newTaskInputRef"
                  v-model="newTaskTitle"
                  autoresize
                  :rows="1"
                  placeholder="What needs to be done?"
                  variant="none"
                  @keydown.enter.prevent="createTask"
                  @keydown.esc="cancelAddingTask"
               />
               <div class="flex justify-end items-center mt-2 gap-2">
                  <UButton
                     size="xs"
                     color="neutral"
                     variant="ghost"
                     @click="cancelAddingTask"
                  >
                     Cancel
                  </UButton>
                  <UButton
                     size="xs"
                     color="primary"
                     :disabled="!newTaskTitle.trim()"
                     @click="createTask"
                     trailing-icon="uil:enter"
                  >
                     Create
                  </UButton>
               </div>
            </UCard>
         </div>
         <div
            v-else
            class="mt-2"
         >
            <UButton
               variant="ghost"
               :color="$resolveTaskStatusColor(props.status)"
               icon="lucide:plus"
               block
               :ui="{
                  base: 'h-12',
               }"
               @click="startAddingTask"
            >
               Add Task
            </UButton>
         </div>
      </UCard>
   </div>
</template>
