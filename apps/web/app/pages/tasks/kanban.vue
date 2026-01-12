<script setup lang="ts">
const appStore = useAppStore()

const { close, data, send } = useWS({
   onConnected: (ws) => {
      ws.send(JSON.stringify({ type: "subscribe:task", data: null }))
   },
})

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

onBeforeMount(async () => {
   await fetchStatuses()
   if (!statuses.value) return
})
</script>

<template>
   <div class="overflow-hidden w-full -m-1 container-height">
      <div
         class="h-full flex flex-nowrap items-stretch gap-4 overflow-x-auto p-1"
      >
         <template v-for="status in statuses">
            <KanbanCard :status="status" />
         </template>
      </div>
   </div>
</template>

<style scoped>
.container-height {
   height: calc(100vh - var(--header-height) - (var(--spacing) * 9));
}
</style>
