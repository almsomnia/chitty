<script setup lang="ts">
import { DetailTask } from "#components"

type TaskByStatus = {
   status: Model.Status
   tasks: Model.Task[]
}

const { data: statuses, execute: fetchStatuses } = await useLazyFetch(
   "/api/statuses",
   {
      method: "get",
      transform: (res) => res.data,
      $fetch: $api as typeof $fetch,
      watch: false,
      immediate: false,
   }
)

async function fetchTasks(
   page: number,
   status: Model.Status
): Promise<TaskByStatus> {
   const response = await $api<API.Response<API.Paginate<Model.Task[]>>>(
      `/api/tasks`,
      {
         method: "get",
         query: {
            page,
            status_id: status.id,
         },
      }
   )
   return {
      status,
      tasks: response.data.data,
   }
}

const taskByStatus = ref<TaskByStatus[]>([])

onBeforeMount(async () => {
   await fetchStatuses()
   if (!statuses.value) return

   let taskPromises: Promise<TaskByStatus>[] = []
   for (const status of statuses.value) {
      taskByStatus.value.push({
         status,
         tasks: [],
      })
      taskPromises.push(fetchTasks(1, status))
   }

   taskByStatus.value = await Promise.all(taskPromises)
})

const dayjs = useDayjs()
function formatDate(date: string | null) {
   if (!date) return "-"
   return dayjs(date).format("DD/MM/YY")
}

function resolveContainerCardColor(status: Model.Status) {
   switch (status.type) {
      case "IDLE":
         return /* @tw */ "bg-elevated dark:bg-muted/50 divide-muted"
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
   if (priority === "LOW") return "success"
   if (priority === "MEDIUM") return "warning"
   return "error"
}

const appStore = useAppStore()
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
   <div class="overflow-hidden w-full -m-1 container-height">
      <div
         class="h-full flex flex-nowrap items-stretch gap-4 overflow-x-auto p-1"
      >
         <template v-for="item in taskByStatus">
            <div class="w-xs shrink-0">
               <UCard
                  variant="soft"
                  :ui="{
                     body: 'sm:p-4 flex flex-col flex-1 min-h-0 -m-1',
                     root: [
                        resolveContainerCardColor(item.status),
                        'max-h-full flex flex-col overflow-hidden'
                     ],
                  }"
               >
                  <div class="mb-2 shrink-0">
                     <UBadge
                        :label="item.status.name"
                        :color="$resolveTaskStatusColor(item.status)"
                        icon="lucide:circle"
                     />
                  </div>
                  <div class="space-y-2 overflow-y-auto overscroll-contain flex-1 scrollbar-thin min-h-0 p-1">
                     <template v-for="task in item.tasks">
                        <UCard
                           variant="outline"
                           :ui="{
                              root: 'rounded-lg cursor-pointer',
                              body: 'sm:p-2',
                           }"
                           @click="onTaskDetail(task)"
                        >
                           <div class="flex flex-col gap-2 select-none">
                              <UTooltip
                                 :text="task.title"
                                 arrow
                                 :ui="{
                                    content: 'max-w-md h-auto bg-inverted',
                                    text: 'whitespace-normal max-w-md text-inverted',
                                 }"
                              >
                                 <p class="text-sm line-clamp-2 font-medium">
                                    {{ task.title }}
                                 </p>
                              </UTooltip>
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
                                    :color="
                                       resolveDateBadgeColor(task.due_date)
                                    "
                                    @click.stop="onDueDateBadgeClick(task)"
                                 />
                                 <UBadge
                                    :label="task.priority"
                                    icon="lucide:flag"
                                    :color="
                                       resolvePriorityBadgeColor(task.priority)
                                    "
                                    variant="soft"
                                    size="sm"
                                 />
                              </div>
                           </div>
                        </UCard>
                     </template>
                  </div>
               </UCard>
            </div>
         </template>
      </div>
   </div>
</template>

<style scoped>
.container-height {
   height: calc(100vh - var(--header-height) - (var(--spacing) * 9));
}
</style>
