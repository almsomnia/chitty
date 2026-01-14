<script setup lang="ts">
import { UBadge } from "#components"

useHead({
   title: "Dashboard",
})

const { data: tasksDueToday, execute: fetchTasksDueToday } = await useLazyFetch(
   "/api/dashboard/tasks-due-today",
   {
      method: "get",
      transform: (res) => res.data,
      immediate: false,
      $fetch: $api as typeof $fetch,
   }
)
const { data: overdueTasks, execute: fetchOverdueTasks } = await useLazyFetch(
   "/api/dashboard/overdue-tasks",
   {
      method: "get",
      transform: (res) => res.data,
      immediate: false,
      $fetch: $api as typeof $fetch,
   }
)

onBeforeMount(async () => {
   await Promise.all([fetchTasksDueToday(), fetchOverdueTasks()])
})

const authStore = useAuthStore()
</script>

<template>
   <div>
      <h1 class="pb-8 pt-2 text-2xl font-bold tracking-tight">Welcome, {{ authStore.user?.name }}!</h1>
      <div class="grid lg:grid-cols-2 gap-4">
         <UCard :ui="{ body: 'p-4 sm:p-4 max-h-72 overflow-y-auto', root: 'text-sm' }">
            <template #header>
               <div class="flex items-center justify-between">
                  <h2 class="font-semibold">Tasks Due Today</h2>
                  <span class="ms-auto text-xs text-toned">
                     {{ tasksDueToday?.length ?? 0 }}
                  </span>
               </div>
            </template>
            <template v-for="item in tasksDueToday">
               <div
                  class="p-4 flex items-center gap-4 flex-nowrap hover:bg-elevated/50 rounded-lg transition"
               >
                  <span class="flex-1 truncate">
                     {{ item.title }}
                  </span>
                  <UBadge
                     :color="$resolveTaskStatusColor(item.status)"
                     variant="subtle"
                     :label="item.status.name"
                  />
               </div>
            </template>
         </UCard>
         <UCard :ui="{ body: 'p-4 sm:p-4 max-h-72 overflow-y-auto', root: 'text-sm' }">
            <template #header>
               <div class="flex items-center justify-between">
                  <h2 class="font-semibold">Overdue Tasks</h2>
                  <span class="ms-auto text-xs text-toned">
                     {{ overdueTasks?.length ?? 0 }}
                  </span>
               </div>
            </template>
            <template v-for="item in overdueTasks">
               <div
                  class="p-4 flex items-center gap-4 flex-nowrap hover:bg-elevated/50 rounded-lg transition"
               >
                  <span class="flex-1 truncate">
                     {{ item.title }}
                  </span>
                  <UBadge
                     color="error"
                     variant="subtle"
                     :label="`Due ${$dayjs(item.due_date).format('DD MMM YY')}`"
                  />
                  <UBadge
                     :color="$resolveTaskStatusColor(item.status)"
                     variant="subtle"
                     :label="item.status.name"
                  />
               </div>
            </template>
         </UCard>
      </div>
   </div>
</template>
