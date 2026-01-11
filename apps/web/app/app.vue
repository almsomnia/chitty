<script setup lang="ts">
const appStore = useAppStore()
</script>

<template>
   <UApp>
      <NuxtRouteAnnouncer />
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
