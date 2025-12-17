<script setup lang="ts">
const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>

<template>
   <header
      class="h-(--header-height) bg-default/75 dark:bg-muted backdrop-blur-sm"
   >
      <div class="px-4 flex items-center justify-between h-full">
         <span class="font-bold">Chitty</span>
         <div class="flex items-center h-full gap-4">
            <UColorModeButton />
            <UUser
               :name="user?.name"
               :description="user?.email"
               to="/"
            />
         </div>
      </div>
   </header>
</template>
