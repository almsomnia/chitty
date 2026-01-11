<script setup lang="ts">
const appStore = useAppStore()
const { status, data, send } = useKanbanWebSocket()

const sendMessage = () => {
   send("Ping from Client!")
}
</script>

<template>
   <UApp>
      <NuxtRouteAnnouncer />
      <div
         class="fixed bottom-4 right-4 z-50 p-4 bg-gray-800 text-white rounded-lg shadow-lg text-xs opacity-75 hover:opacity-100 transition-opacity"
      >
         <p>WS Status: {{ status }}</p>
         <p>Last Message: {{ data }}</p>
         <button
            @click="sendMessage"
            class="mt-2 bg-primary-500 hover:bg-primary-600 px-2 py-1 rounded text-white"
         >
            Send Ping
         </button>
      </div>
      <NuxtLayout>
         <NuxtPage />
      </NuxtLayout>
      <AppModal
         v-model="appStore.dialog.show"
         :title="appStore.dialog.title"
         :class="appStore.dialog.class"
      >
         <component :is="appStore.dialog.body" />
      </AppModal>
   </UApp>
</template>
