<script setup lang="ts">
import Draggable from "vuedraggable"
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

      // Handle Broadcast: Update list for all users
      if (
         message.type === "task:created"
         && message.data.status_id === props.status.id
      ) {
         if (!tasks.value.some((t) => t.id === message.data.id)) {
            tasks.value.push(message.data)
            totalTasks.value++
            tasks.value = tasks.value.toSorted((a, b) => {
               if (!a.rank || !b.rank) {
                  return 0
               }
               return a.rank.localeCompare(b.rank)
            })
         }
      }

      // Handle Broadcast: Update task (status change or reorder)
      if (message.type === "task:updated") {
         const updatedTask = message.data
         const index = tasks.value.findIndex((t) => t.id === updatedTask.id)

         // Task belongs to this column
         if (updatedTask.status_id === props.status.id) {
            if (index !== -1) {
               // Update existing task
               tasks.value[index] = updatedTask
            } else {
               // Add new task (moved from another column)
               tasks.value.push(updatedTask)
               totalTasks.value++
            }
            // Re-sort based on new rank
            tasks.value = tasks.value.toSorted((a, b) => {
               if (!a.rank || !b.rank) {
                  return 0
               }
               return a.rank.localeCompare(b.rank)
            })
         }
         // Task no longer belongs to this column
         else if (index !== -1) {
            tasks.value.splice(index, 1)
            totalTasks.value--
         }
      }

      // Handle Confirmation: Notify the creator
      if (message.type === "task:create" && message.data.task.status_id == props.status.id) {
         appStore.notify({
            title: message.data.message,
            color: "success",
         })
         tasks.value.push(message.data.task)
      }

      // Handle Confirmation: Update (do nothing per requirements)
      if (message.type === "task:update") {
         // no-op
      }
   } catch (error) {
      console.error("Failed to parse WS message", error)
   }
})

const tasks = ref<Model.Task[]>([])
const totalTasks = shallowRef(0)
const page = shallowRef(1)
const hasMoreData = computed(() => {
   return tasks.value.length < totalTasks.value
})

async function fetchTasks(status: Model.Status) {
   const response = await $api<API.Response<API.Paginate<Model.Task[]>>>(
      `/api/tasks`,
      {
         method: "get",
         query: {
            page: page.value,
            per_page: 10,
            status_id: status.id,
         },
      }
   )

   tasks.value.push(...response.data.data)
   totalTasks.value = response.data.total
   page.value++
}

const fetchTrigger = useTemplateRef("fetchTrigger")
useIntersectionObserver(fetchTrigger, ([entry], el) => {
   if (entry?.isIntersecting && hasMoreData.value) {
      fetchTasks(props.status)
   }
})

onMounted(async () => {
   await fetchTasks(props.status)
})

function resolveContainerCardColor(status: Model.Status) {
   switch (status.type) {
      case "IDLE":
         return /* @tw */ "bg-accented/25 border border-default dark:border-0 dark:bg-elevated/25 divide-muted [&_.ct--task-count]:text-elevated"
      case "ACTIVE":
         return /* @tw */ "bg-info-100/50 dark:bg-info-950/35 divide-info-200 dark:divide-info-900 [&_.ct--task-count]:text-info"
      case "CLOSE":
         return /* @tw */ "bg-success-100/50 dark:bg-success-950/35 divide-success-200 dark:divide-success-900 [&_.ct--task-count]:text-success"
      default:
         throw new Error("Invalid status type")
   }
}

async function onChange(event: any) {
   console.log("🚀 ~ :104 ~ onChange ~ event:", event)
   if (event.removed) {
      totalTasks.value--
   }
   if (event.added) {
      const { element, newIndex } = event.added
      await handleTaskUpdate(element, newIndex)
      totalTasks.value++
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
         <div class="mb-2 shrink-0 flex items-center">
            <UBadge
               :label="props.status.name"
               :color="$resolveTaskStatusColor(props.status)"
               icon="lucide:circle"
            />
            <span class="ms-4 text-sm ct--task-count">
               {{ totalTasks }}
            </span>
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
               <KanbanTaskCard
                  :data="task"
               />
            </template>
            <template #footer>
               <div ref="fetchTrigger" />
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
