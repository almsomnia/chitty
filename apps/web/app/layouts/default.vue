<template>
   <AppHeader class="fixed top-0 inset-x-0 w-full border-b border-accented" />
   <AppSidebar class="fixed start-0 inset-y-0 h-full border-e border-accented" />
   <main class="main-height ms-(--sidebar-width) mt-(--header-height) p-2">
      <slot />
   </main>
</template>

<style scoped>
.main-height {
   height: calc(100vh - var(--header-height));
}
</style>
