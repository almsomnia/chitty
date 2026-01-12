<script setup lang="ts">
import { DetailTask } from "#components"

const props = defineProps<{
   data: Model.Task
}>()

const appStore = useAppStore()
const dayjs = useDayjs()

function formatDate(date: string | null) {
   if (!date) return "-"
   return dayjs(date).format("DD/MM/YY")
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

function onDueDateBadgeClick(task: Model.Task) {
   alert("hehe")
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
</script>

<template>
   <UCard
      variant="soft"
      :data-task-id="props.data"
      :ui="{
         root: 'rounded-lg cursor-pointer bg-default dark:bg-elevated',
         body: 'sm:p-2',
      }"
      @click="onTaskDetail(props.data)"
   >
      <div class="flex flex-col gap-2 select-none">
         <p class="text-sm line-clamp-2 font-medium">
            {{ props.data.title }}
         </p>
         <div class="flex items-center gap-2">
            <UAvatar
               v-if="props.data.assignee"
               :text="props.data.assignee.name.charAt(0)"
               size="xs"
            />
            <UBadge
               :label="formatDate(props.data.due_date)"
               icon="lucide:calendar"
               size="sm"
               variant="subtle"
               :color="resolveDateBadgeColor(props.data.due_date)"
               @click.stop="onDueDateBadgeClick(props.data)"
            />
            <UBadge
               :label="props.data.priority"
               icon="lucide:flag"
               :color="resolvePriorityBadgeColor(props.data.priority)"
               variant="soft"
               size="sm"
            />
         </div>
      </div>
   </UCard>
</template>
